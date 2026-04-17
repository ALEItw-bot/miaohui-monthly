import { Redis } from '@upstash/redis';

// ==========================================
// Redis Client（沿用現有環境變數）
// ==========================================
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// 備份資料的 key prefix（與一般快取區隔）
const BACKUP_PREFIX = 'notion:backup:';

// 備份保存時間：7 天（就算 Notion 掛整週還能撐）
const BACKUP_TTL_SECONDS = 7 * 24 * 60 * 60;

// 短期快取時間：5 分鐘（減少 Notion API 呼叫）
const CACHE_TTL_SECONDS = 5 * 60;

// ==========================================
// 核心包裝函式：withFallback
// ==========================================

/**
 * 把任何 Notion API 呼叫包起來，加上三層保護：
 * 1. 短期快取（5 分鐘）：減少 Notion 呼叫，提升速度
 * 2. 成功時：順手備份一份到 Redis（7 天）
 * 3. 失敗時：自動回傳最後一次成功的備份
 *
 * @param cacheKey  這次資料的唯一識別（例如 'events:list:all'）
 * @param fetcher   真正呼叫 Notion 的函式
 * @param options   可選設定
 */
export async function withFallback<T>(
  cacheKey: string,
  fetcher: () => Promise<T>,
  options?: {
    cacheTtl?: number;     // 短期快取秒數（預設 300）
    backupTtl?: number;    // 備份保留秒數（預設 604800）
    skipCache?: boolean;   // 強制跳過短期快取（後台手動更新用）
  },
): Promise<T> {
  const {
    cacheTtl = CACHE_TTL_SECONDS,
    backupTtl = BACKUP_TTL_SECONDS,
    skipCache = false,
  } = options || {};

  const cacheFullKey = `${BACKUP_PREFIX}cache:${cacheKey}`;
  const backupFullKey = `${BACKUP_PREFIX}stable:${cacheKey}`;

  // ---- 第 1 層：短期快取 ----
  if (!skipCache) {
    try {
      const cached = await redis.get<T>(cacheFullKey);
      if (cached !== null && cached !== undefined) {
        return cached;
      }
    } catch (err) {
      console.warn(`[fallback] Redis 快取讀取失敗 (${cacheKey}):`, err);
      // 即使 Redis 掛了也繼續走 Notion
    }
  }

  // ---- 第 2 層：真的打 Notion ----
  try {
    const data = await fetcher();

    // 成功 → 同時寫入「短期快取」與「長期備份」
    // 用 Promise.allSettled 確保 Redis 寫入失敗不會中斷主流程
    await Promise.allSettled([
      redis.set(cacheFullKey, data, { ex: cacheTtl }),
      redis.set(backupFullKey, data, { ex: backupTtl }),
    ]);

    return data;
  } catch (notionError) {
    // ---- 第 3 層：Notion 掛了 → 拿備份 ----
    console.error(
      `[fallback] Notion API 失敗 (${cacheKey})，改用備份：`,
      notionError,
    );

    try {
      const backup = await redis.get<T>(backupFullKey);
      if (backup !== null && backup !== undefined) {
        console.warn(`[fallback] 已啟用備份資料 (${cacheKey})`);
        return backup;
      }
    } catch (redisError) {
      console.error(`[fallback] Redis 備份讀取也失敗：`, redisError);
    }

    // 連備份都沒有 → 拋出原始錯誤，讓上層決定怎麼處理
    throw notionError;
  }
}

// ==========================================
// 手動清除快取（後台編輯完 Notion 後呼叫）
// ==========================================

/**
 * 清除指定 cacheKey 的短期快取（保留長期備份）
 * 用在：Notion 後台更新後，透過 /api/revalidate 觸發
 */
export async function invalidateCache(cacheKey: string): Promise<void> {
  const cacheFullKey = `${BACKUP_PREFIX}cache:${cacheKey}`;
  try {
    await redis.del(cacheFullKey);
  } catch (err) {
    console.warn(`[fallback] 清除快取失敗 (${cacheKey}):`, err);
  }
}

/**
 * 清除所有 Notion 相關快取（大型更新後使用）
 */
export async function invalidateAllNotionCache(): Promise<void> {
  try {
    const keys = await redis.keys(`${BACKUP_PREFIX}cache:*`);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (err) {
    console.warn('[fallback] 清除全部快取失敗:', err);
  }
}

// ==========================================
// 健康檢查（給監控用）
// ==========================================

/**
 * 檢查 Notion 是否正常、備份是否存在
 * 可以在 /api/health 路由中呼叫
 */
export async function checkFallbackStatus(cacheKey: string): Promise<{
  hasCache: boolean;
  hasBackup: boolean;
  cacheAge?: number;
}> {
  const cacheFullKey = `${BACKUP_PREFIX}cache:${cacheKey}`;
  const backupFullKey = `${BACKUP_PREFIX}stable:${cacheKey}`;

  try {
    const [cacheTtl, backupExists] = await Promise.all([
      redis.ttl(cacheFullKey),
      redis.exists(backupFullKey),
    ]);

    return {
      hasCache: cacheTtl > 0,
      hasBackup: backupExists === 1,
      cacheAge: cacheTtl > 0 ? CACHE_TTL_SECONDS - cacheTtl : undefined,
    };
  } catch {
    return { hasCache: false, hasBackup: false };
  }
}