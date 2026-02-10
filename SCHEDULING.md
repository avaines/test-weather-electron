# Scheduling Degree Days Collection

This guide shows how to automatically run the degree days collector daily using cron (Linux/Mac) or Task Scheduler (Windows).

## Two Methods Available

### Method 1: Built Executable (Recommended - No Node.js Required)
The built Windows/Mac executable can run in **headless mode** without requiring Node.js installation. Perfect for end users.

### Method 2: CLI with Node.js (For Development)
For development or if you have Node.js installed, use the CLI directly.

---

## Method 1: Built Executable (No Node.js Required)

### Windows - Using Built Executable

The built `.exe` file includes everything needed - no Node.js installation required!

#### Quick Setup with Provided Scripts

1. **After building the app**, you'll find these files in the `dist` folder:
   - `Degree Days Collector.exe` - The executable
   - `schedule-windows.bat` - Simple batch script
   - `schedule-windows.ps1` - PowerShell script with logging

2. **Edit the configuration** in `schedule-windows.bat`:
   ```batch
   set API_KEY=your_actual_api_key
   set COORDS=51.5074,-0.1278
   set OUTPUT_DIR=C:\Data\DegreeDays
   ```

3. **Create scheduled task**:
   ```cmd
   schtasks /create /tn "DegreeDaysCollection" /tr "C:\path\to\schedule-windows.bat" /sc daily /st 09:00
   ```

#### Manual Setup

**Option A: Task Scheduler GUI**
1. Open Task Scheduler (`taskschd.msc`)
2. Create Basic Task → Name: "Degree Days Collection"
3. Trigger: Daily at 9:00 AM
4. Action: Start a program
   - Program: `C:\path\to\Degree Days Collector.exe`
   - Arguments: `--headless --apikey YOUR_KEY --coords "51.5074,-0.1278" --output C:\Data\DegreeDays`
5. Finish

**Option B: Command Line**
```cmd
schtasks /create /tn "DegreeDaysCollection" ^
  /tr "\"C:\Program Files\DegreeDays\Degree Days Collector.exe\" --headless --apikey YOUR_KEY --coords \"51.5074,-0.1278\" --output C:\Data\DegreeDays" ^
  /sc daily /st 09:00 /ru SYSTEM
```

### macOS/Linux - Using Built Executable

#### Quick Setup with Provided Script

1. **After building the app**, copy `schedule-unix.sh` alongside your `.app` file

2. **Edit configuration** in `schedule-unix.sh`:
   ```bash
   API_KEY="your_actual_api_key"
   COORDS="51.5074,-0.1278"
   OUTPUT_DIR="$HOME/Documents/DegreeDays"
   ```

3. **Make executable**:
   ```bash
   chmod +x schedule-unix.sh
   ```

4. **Add to crontab**:
   ```bash
   crontab -e
   # Add this line:
   0 9 * * * /path/to/schedule-unix.sh
   ```

#### Manual Setup

```bash
# Edit crontab
crontab -e

# Add line (adjust path to your .app):
0 9 * * * "/Applications/Degree Days Collector.app/Contents/MacOS/Degree Days Collector" --headless --apikey YOUR_KEY --coords "51.5074,-0.1278" --output ~/Documents/DegreeDays
```

---

## Method 2: CLI with Node.js (Development)

### CLI Usage

For development or if you have Node.js installed:

```bash
node cli.js --apikey YOUR_API_KEY --coords "LATITUDE,LONGITUDE"
```

### Options

| Flag | Description | Example |
|------|-------------|---------|
| `--apikey`, `-k` | Weather DataHub API key | `--apikey abc123xyz` |
| `--coords`, `-c` | Location coordinates | `--coords "51.5074,-0.1278"` |
| `--output`, `-o` | Output directory (optional) | `--output /path/to/data` |
| `--help`, `-h` | Show help | `--help` |

### Examples

```bash
# Basic usage (saves to ./data)
node cli.js -k abc123 -c "51.5074,-0.1278"

# Custom output directory
node cli.js -k abc123 -c "51.5074,-0.1278" -o ~/Documents/degree-days

# Using full flag names
node cli.js --apikey abc123 --coords "51.5074,-0.1278" --output /var/data
```

### Linux/Mac - Using Node.js CLI

Only if you have Node.js installed:

#### 1. Create a Configuration File

Store your credentials securely:

```bash
# Create config directory
mkdir -p ~/.config/degree-days

# Create environment file
cat > ~/.config/degree-days/config.env << 'EOF'
METOFFICE_API_KEY=your_api_key_here
LOCATION_COORDS=51.5074,-0.1278
DATA_DIR=/path/to/output
EOF

# Secure the file
chmod 600 ~/.config/degree-days/config.env
```

### 2. Create a Wrapper Script

```bash
cat > ~/.config/degree-days/collect.sh << 'EOF'
#!/bin/bash

# Load configuration
source ~/.config/degree-days/config.env

# Change to app directory
cd /path/to/test-weather-electron

# Run collector
node cli.js \
  --apikey "$METOFFICE_API_KEY" \
  --coords "$LOCATION_COORDS" \
  --output "$DATA_DIR" \
  >> ~/.config/degree-days/collect.log 2>&1

# Log completion
echo "Collection completed at $(date)" >> ~/.config/degree-days/collect.log
EOF

chmod +x ~/.config/degree-days/collect.sh
```

### 3. Set Up Cron Job

Edit your crontab:

```bash
crontab -e
```

Add one of these schedules:

```cron
# Daily at 9:00 AM
0 9 * * * ~/.config/degree-days/collect.sh

# Daily at midnight
0 0 * * * ~/.config/degree-days/collect.sh

# Every day at 6:00 AM
0 6 * * * ~/.config/degree-days/collect.sh

# Weekdays only at 8:00 AM
0 8 * * 1-5 ~/.config/degree-days/collect.sh
```

### 4. Verify Cron Job

```bash
# List your cron jobs
crontab -l

# Check logs
tail -f ~/.config/degree-days/collect.log

# Test the script manually
~/.config/degree-days/collect.sh
```

### Windows - Using Node.js CLI

Only if you have Node.js installed:

#### Method 1: Using Task Scheduler GUI

1. **Open Task Scheduler**
   - Press `Win + R`, type `taskschd.msc`, press Enter

2. **Create Basic Task**
   - Click "Create Basic Task" in right panel
   - Name: "Degree Days Collection"
   - Description: "Daily collection of degree days data"

3. **Set Trigger**
   - Choose "Daily"
   - Set start time (e.g., 9:00 AM)
   - Recur every: 1 day

4. **Set Action**
   - Action: "Start a program"
   - Program/script: `C:\Program Files\nodejs\node.exe`
   - Arguments: `cli.js -k YOUR_API_KEY -c "51.5074,-0.1278" -o C:\Data\DegreeDays`
   - Start in: `C:\path\to\test-weather-electron`

5. **Configure Settings**
   - ✓ Run whether user is logged on or not
   - ✓ Run with highest privileges (if needed)
   - Configure for: Windows 10

### Method 2: Using PowerShell Script

Create `C:\Scripts\collect-degree-days.ps1`:

```powershell
# Configuration
$ApiKey = "your_api_key_here"
$Coords = "51.5074,-0.1278"
$OutputDir = "C:\Data\DegreeDays"
$AppDir = "C:\path\to\test-weather-electron"
$LogFile = "C:\Scripts\degree-days.log"

# Change to app directory
Set-Location $AppDir

# Run collector
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
Add-Content -Path $LogFile -Value "[$timestamp] Starting collection..."

try {
    node cli.js -k $ApiKey -c $Coords -o $OutputDir 2>&1 | Tee-Object -Append -FilePath $LogFile
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Add-Content -Path $LogFile -Value "[$timestamp] Collection completed successfully"
} catch {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Add-Content -Path $LogFile -Value "[$timestamp] ERROR: $_"
}
```

Then create the scheduled task:

```powershell
# Create task in PowerShell (Run as Administrator)
$Action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-NoProfile -ExecutionPolicy Bypass -File C:\Scripts\collect-degree-days.ps1"
$Trigger = New-ScheduledTaskTrigger -Daily -At 9am
$Principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest
$Settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries

Register-ScheduledTask -TaskName "DegreeDaysCollection" -Action $Action -Trigger $Trigger -Principal $Principal -Settings $Settings
```

### Method 3: Using schtasks Command

```cmd
schtasks /create /tn "DegreeDaysCollection" /tr "node C:\path\to\test-weather-electron\cli.js -k YOUR_KEY -c \"51.5074,-0.1278\"" /sc daily /st 09:00 /ru SYSTEM
```

## Docker Setup (Optional)

For more isolated execution:

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .

ENTRYPOINT ["node", "cli.js"]
```

```bash
# Build
docker build -t degree-days-collector .

# Run
docker run --rm \
  -v $(pwd)/data:/app/data \
  degree-days-collector \
  -k YOUR_API_KEY \
  -c "51.5074,-0.1278" \
  -o /app/data
```

## Troubleshooting

### Cron Issues (Linux/Mac)

```bash
# Check if cron is running
sudo systemctl status cron  # or 'crond' on some systems

# Check cron logs
tail -f /var/log/syslog | grep CRON
# or
tail -f /var/log/cron

# Test manually
bash -x ~/.config/degree-days/collect.sh
```

### Task Scheduler Issues (Windows)

1. Check Task History in Task Scheduler
2. Ensure Node.js is in system PATH
3. Run PowerShell as Administrator
4. Check execution policy: `Get-ExecutionPolicy`
5. Set if needed: `Set-ExecutionPolicy RemoteSigned`

### Common Issues

**Issue:** "node: command not found"
- **Solution:** Use full path to node executable
  - Mac: `/usr/local/bin/node` or `$(which node)`
  - Windows: `C:\Program Files\nodejs\node.exe`

**Issue:** API key not working
- **Solution:** Ensure key is not expired, check quotas on Weather DataHub

**Issue:** Permission denied
- **Solution:** 
  - Linux/Mac: `chmod +x collect.sh` and ensure output directory is writable
  - Windows: Run Task Scheduler as Administrator

**Issue:** CSV not appending
- **Solution:** Check output directory path is consistent across runs
- **Note:** All data goes into single file `degree_days_data.csv`

## Monitoring

### Linux/Mac Log Monitoring

```bash
# Watch logs in real-time
tail -f ~/.config/degree-days/collect.log

# Check last 10 collections
tail -20 ~/.config/degree-days/collect.log

# Search for errors
grep -i error ~/.config/degree-days/collect.log
```

### Windows Log Monitoring

```powershell
# View recent logs
Get-Content C:\Scripts\degree-days.log -Tail 20

# Follow logs
Get-Content C:\Scripts\degree-days.log -Wait

# Search for errors
Select-String -Path C:\Scripts\degree-days.log -Pattern "ERROR"
```

## Best Practices

1. **Secure API Keys**
   - Never commit API keys to version control
   - Use environment files with restricted permissions
   - Rotate keys periodically

2. **Backup Data**
   - Regularly backup CSV files
   - Consider cloud sync (Dropbox, OneDrive, etc.)

3. **Monitor Execution**
   - Set up log rotation
   - Check logs periodically
   - Set up email alerts for failures (optional)

4. **Test Before Deploying**
   - Run CLI manually first
   - Verify CSV files are created correctly
   - Check data appears in correct format

5. **Handle Failures**
   - Script will exit with code 1 on error
   - Use this for alerting in cron/Task Scheduler
   - CSV appends, so missed days can be backfilled

## Email Notifications (Optional)

### Linux/Mac

```bash
# Install mailutils
sudo apt-get install mailutils  # Ubuntu/Debian
# or
brew install mailutils  # Mac with Homebrew

# Modify wrapper script
cat > ~/.config/degree-days/collect.sh << 'EOF'
#!/bin/bash
source ~/.config/degree-days/config.env
cd /path/to/test-weather-electron

if ! node cli.js -k "$METOFFICE_API_KEY" -c "$LOCATION_COORDS" -o "$DATA_DIR" >> ~/.config/degree-days/collect.log 2>&1; then
  echo "Degree days collection failed. Check logs at ~/.config/degree-days/collect.log" | mail -s "Degree Days Collection Failed" your@email.com
fi
EOF
```

### Windows

```powershell
# Add to PowerShell script
if ($LASTEXITCODE -ne 0) {
    Send-MailMessage `
        -To "your@email.com" `
        -From "noreply@yourdomain.com" `
        -Subject "Degree Days Collection Failed" `
        -Body "Check logs at C:\Scripts\degree-days.log" `
        -SmtpServer "smtp.yourdomain.com"
}
```

## Verification

After setting up, verify it's working:

```bash
# Check CSV file exists and is being updated
ls -lh data/degree_days_*.csv

# View latest entries
tail -5 data/degree_days_$(date +%Y_%m).csv

# Count number of data points
wc -l data/degree_days_*.csv
```
