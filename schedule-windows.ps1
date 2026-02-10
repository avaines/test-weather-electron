# PowerShell script for scheduling degree days collection
# Edit the variables below with your settings

# ===== CONFIGURATION =====
$ApiKey = "YOUR_API_KEY_HERE"
$Coords = "51.5074,-0.1278" # Latitude,Longitude
$OutputDir = "C:\Data\DegreeDays"
$LogFile = "$PSScriptRoot\degree-days.log"
# =========================

# Get the executable path
$ExePath = Join-Path $PSScriptRoot "Degree Days Collector.exe"

# Log start
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
Add-Content -Path $LogFile -Value "[$timestamp] Starting collection..."

try {
    # Run in headless mode
    & $ExePath --headless --apikey $ApiKey --coords $Coords --output $OutputDir 2>&1 | Tee-Object -Append -FilePath $LogFile

    if ($LASTEXITCODE -eq 0) {
        $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        Add-Content -Path $LogFile -Value "[$timestamp] Collection completed successfully"
    } else {
        $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        Add-Content -Path $LogFile -Value "[$timestamp] Collection failed with exit code: $LASTEXITCODE"
    }

    exit $LASTEXITCODE
} catch {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Add-Content -Path $LogFile -Value "[$timestamp] ERROR: $_"
    exit 1
}
