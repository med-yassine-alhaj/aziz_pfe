param(
    [string]$email = 'client@example.com',
    [string]$password = 'secret123',
    [string]$baseUrl = 'http://127.0.0.1:8000'
)

$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
Write-Output "Logging in as $email..."
$login = Invoke-RestMethod -Uri "$baseUrl/api/login" -Method Post -ContentType 'application/json' -Body (@{email=$email; password=$password} | ConvertTo-Json)

if (-not $login -or -not $login.token) {
    Write-Error "Login failed or no token returned. Response: $($login | ConvertTo-Json -Depth 5)"
    exit 1
}

$token = $login.token
Write-Output "Got token: $token"

Write-Output "Calling $baseUrl/api/user with Bearer token..."
$user = Invoke-RestMethod -Uri "$baseUrl/api/user" -Method Get -Headers @{ Authorization = "Bearer $token" }

Write-Output "User response:"
$user | ConvertTo-Json -Depth 10

Write-Output "Done. Use the printed token for subsequent API calls in the Authorization header."
