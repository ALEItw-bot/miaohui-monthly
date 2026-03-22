# generate-image-list.ps1
$folders = @("carousel", "news", "popup")
foreach ($folder in $folders) {
    $dir = "public/$folder"
    $jsonPath = "$dir/images.json"
    if (Test-Path $dir) {
        $files = Get-ChildItem $dir -File |
            Where-Object { $_.Name -match '\.(jpg|jpeg|png|webp|gif)$' } |
            Sort-Object Name |
            ForEach-Object { "/$folder/$($_.Name)" }
        if ($files) {
            $files | ConvertTo-Json | Out-File -Encoding utf8 $jsonPath
        } else {
            '[]' | Out-File -Encoding utf8 $jsonPath
        }
    }
}
Write-Host "Done! images.json updated for: $($folders -join ', ')"