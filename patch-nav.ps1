$files = Get-ChildItem -Path "c:\Users\LeinerSuarez\Desktop\Proyectos\PirateWyki" -Filter *.html -Recurse

foreach ($file in $files) {
    if ($file.Name -match "index.html") { continue }
    
    $content = Get-Content $file.FullName -Raw

    # Check if this file has standard nav items
    if ($content -match '(Naves</a></li>)') {
        # Check if it's missing the Builds link
        if ($content -notmatch 'Builds</a></li>') {
            # Determine the relative path to ships.html
            if ($content -match '<a href="([^"]*)ships\.html"') {
                $prefix = $matches[1]
                $replacement = "`$1`n                <li class=`"nav-item`"><a href=`"${prefix}builds.html`" class=`"nav-link`"><i class=`"fas fa-tools`"></i> Builds</a></li>"
                $newContent = $content -replace '(Naves</a></li>)', $replacement
                Set-Content -Path $file.FullName -Value $newContent -Encoding UTF8
                Write-Host "Patched $($file.FullName)"
            }
        }
    }
}
