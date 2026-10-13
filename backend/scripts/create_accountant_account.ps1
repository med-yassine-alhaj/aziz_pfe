param(
    [string]$name = 'Comptable ENGINEERIUM SARL',
    [string]$email = 'comptable@engineerium.tn',
    [string]$phone = '+212600000002',
    [string]$password = 'Comptable@2024'
)

$php = 'C:\php-8.2.23\php.exe'
$script = Join-Path $PSScriptRoot 'upsert_accountant_user.php'

& $php $script $name $email $phone $password
