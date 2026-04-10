/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://miaohui.tw',
  generateRobotsTxt: false, // 已有 robots.ts，不需重複產生
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
}