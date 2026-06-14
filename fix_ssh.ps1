# Fix Windows OpenSSH Server service

Write-Host "=== SSH Service Fix Script ===" -ForegroundColor Cyan

# 1. Check if sshd account exists
try {
    $sshdUser = Get-LocalUser -Name "sshd" -ErrorAction Stop
    Write-Host "sshd user exists: $($sshdUser.Name)" -ForegroundColor Green
} catch {
    Write-Host "sshd user missing - reinstalling OpenSSH Server..." -ForegroundColor Yellow
    Remove-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0 -ErrorAction SilentlyContinue
    Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0
}

# 2. Ensure sshd_config is valid
$sshdConfig = @"
Port 22
PasswordAuthentication yes
PubkeyAuthentication yes
Subsystem sftp sftp-server.exe
StrictModes no

HostKey __PROGRAMDATA__/ssh/ssh_host_rsa_key
HostKey __PROGRAMDATA__/ssh/ssh_host_ecdsa_key
HostKey __PROGRAMDATA__/ssh/ssh_host_ed25519_key

ClientAliveInterval 30
ClientAliveCountMax 3
"@
$sshdConfig | Out-File -FilePath 'C:\ProgramData\ssh\sshd_config' -Encoding ASCII
Write-Host "sshd_config written" -ForegroundColor Green

# 3. Ensure host keys exist
$keys = @('ssh_host_rsa_key', 'ssh_host_ecdsa_key', 'ssh_host_ed25519_key')
foreach ($key in $keys) {
    $keyPath = "C:\ProgramData\ssh\$key"
    if (-not (Test-Path $keyPath)) {
        Write-Host "Generating $key..." -ForegroundColor Yellow
        if ($key -eq 'ssh_host_rsa_key') { ssh-keygen -t rsa -b 4096 -f $keyPath -N '""' }
        elseif ($key -eq 'ssh_host_ecdsa_key') { ssh-keygen -t ecdsa -b 256 -f $keyPath -N '""' }
        elseif ($key -eq 'ssh_host_ed25519_key') { ssh-keygen -t ed25519 -f $keyPath -N '""' }
    }
}

# 4. Kill any process on port 22
$port22 = netstat -ano | Select-String ':22'
if ($port22) {
    foreach ($line in $port22) {
        $parts = $line -split '\s+'
        $procId = $parts[-1]
        if ($procId -match '^\d+$') {
            Write-Host "Killing PID $procId on port 22..." -ForegroundColor Yellow
            taskkill /F /PID $procId 2>$null
        }
    }
}

# 5. Fix service and start
Set-Service sshd -StartupType Automatic -ErrorAction SilentlyContinue
Start-Service sshd -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# 6. Verify
$svc = Get-Service sshd
Write-Host ""
Write-Host "=== Result ===" -ForegroundColor Cyan
Write-Host "sshd service status: $($svc.Status)" -ForegroundColor $(if($svc.Status -eq 'Running'){'Green'}else{'Red'})

# Test config
$test = & 'C:\Windows\System32\OpenSSH\sshd.exe' -t 2>&1
if ($test) {
    Write-Host "Config test output: $test" -ForegroundColor Red
} else {
    Write-Host "Config test: OK" -ForegroundColor Green
}

Write-Host ""
Write-Host "If status is still Stopped, the sshd user may be corrupted." -ForegroundColor Yellow
Write-Host "Run: Remove-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0" -ForegroundColor Yellow
Write-Host "Then: Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0" -ForegroundColor Yellow
