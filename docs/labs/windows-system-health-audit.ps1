#requires -Version 5.1
<#
.SYNOPSIS
    Read-only system health snapshot for an authorized Windows lab computer.
.DESCRIPTION
    Collects basic operating system, uptime, disk and service information
    without changing configuration or exporting personal data.
    Run only on systems you own or have permission to inspect.
.NOTES
    Demonstration script; validate in your own isolated lab first.
#>
[CmdletBinding()]
param(
    [string[]] $ServiceNames = @('w32time', 'WinRM', 'EventLog')
)

$ErrorActionPreference = 'Stop'

try {
    $os = Get-CimInstance -ClassName Win32_OperatingSystem
    $now = Get-Date
    $uptime = $now - $os.LastBootUpTime

    $diskSummary = @(Get-CimInstance -ClassName Win32_LogicalDisk -Filter "DriveType = 3" |
        Select-Object DeviceID,
            @{Name = 'SizeGB'; Expression = { [math]::Round($_.Size / 1GB, 2) }},
            @{Name = 'FreeGB'; Expression = { [math]::Round($_.FreeSpace / 1GB, 2) }},
            @{Name = 'FreePercent'; Expression = {
                if ($_.Size -gt 0) { [math]::Round(100 * $_.FreeSpace / $_.Size, 1) } else { $null }
            }})

    $services = foreach ($name in $ServiceNames) {
        $service = Get-Service -Name $name -ErrorAction SilentlyContinue
        [pscustomobject]@{
            Name   = $name
            Status = if ($service) { [string]$service.Status } else { 'Not installed' }
        }
    }

    [pscustomobject]@{
        CollectedAt   = $now.ToString('o')
        OS            = $os.Caption
        Version       = $os.Version
        UptimeDays    = [math]::Round($uptime.TotalDays, 2)
        FixedDisks    = $diskSummary
        ServiceStatus = @($services)
    } | ConvertTo-Json -Depth 5
}
catch {
    Write-Error "System health collection failed: $($_.Exception.Message)"
    exit 1
}
