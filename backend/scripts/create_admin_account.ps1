param(
    [string]$name = 'Admin F_MCOM',
    [string]$email = 'admin@fmcom.ma',
    [string]$phone = '+212600000001',
    [string]$password = 'Admin@2024'
)

$php = 'C:\php-8.2.23\php.exe'
$script = Join-Path $PSScriptRoot 'upsert_admin_user.php'

& $php $script $name $email $phone $password
