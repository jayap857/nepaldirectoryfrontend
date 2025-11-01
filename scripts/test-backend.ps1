Param(
    [string]$BaseUrl = "http://localhost:8000/api"
)

Write-Host "Testing backend connectivity to $BaseUrl"

function Test-Get {
    param($url)
    try {
        $resp = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 10
        return @{ ok = $true; status = $resp.StatusCode; statusText = $resp.StatusDescription; length = $resp.Content.Length }
    } catch {
        return @{ ok = $false; error = $_.Exception.Message }
    }
}

function Test-PostRegister {
    param($url)
    $body = @{ username = 'ps_test_user'; email = 'ps_test@example.com'; password = 'Testpass123!'; password_confirm = 'Testpass123!' } | ConvertTo-Json
    try {
        $resp = Invoke-RestMethod -Uri $url -Method POST -ContentType 'application/json' -Body $body -TimeoutSec 10
        return @{ ok = $true; data = $resp }
    } catch {
    return @{ ok = $false; error = $_.Exception.Message; raw = $null -ne $_.Exception.Response }
    }
}

$getUrl = "$BaseUrl/"
$registerUrl = "$BaseUrl/register/"

Write-Host "GET $getUrl"
$getResult = Test-Get -url $getUrl
Write-Host ("GET result: " + (ConvertTo-Json $getResult -Depth 5))

Write-Host "POST $registerUrl"
$postResult = Test-PostRegister -url $registerUrl
Write-Host ("POST result: " + (ConvertTo-Json $postResult -Depth 5))

if (-not $getResult.ok -or -not $postResult.ok) {
    Write-Host "One or more checks failed. If GET fails, the server isn't reachable. If POST fails but GET succeeded, check CORS and endpoint path." -ForegroundColor Yellow
} else {
    Write-Host "All checks succeeded." -ForegroundColor Green
}

Write-Host "Done."
