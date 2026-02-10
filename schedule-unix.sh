#!/bin/bash
# Shell script for scheduling degree days collection (macOS/Linux)
# Edit the variables below with your settings

# ===== CONFIGURATION =====
API_KEY="YOUR_API_KEY_HERE"
COORDS="0,0" # Latitude,Longitude
OUTPUT_DIR="$HOME/Documents/DegreeDays"
LOG_FILE="$HOME/.degree-days.log"
# =========================

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Find the app executable
if [ -f "$SCRIPT_DIR/Degree Days Collector.app/Contents/MacOS/Degree Days Collector" ]; then
    APP_PATH="$SCRIPT_DIR/Degree Days Collector.app/Contents/MacOS/Degree Days Collector"
elif [ -f "$SCRIPT_DIR/degree-days-collector" ]; then
    APP_PATH="$SCRIPT_DIR/degree-days-collector"
else
    echo "Error: Could not find executable" | tee -a "$LOG_FILE"
    exit 1
fi

# Log start
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Starting collection..." >> "$LOG_FILE"

# Run in headless mode
if "$APP_PATH" --headless --apikey "$API_KEY" --coords "$COORDS" --output "$OUTPUT_DIR" >> "$LOG_FILE" 2>&1; then
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Collection completed successfully" >> "$LOG_FILE"
    exit 0
else
    EXIT_CODE=$?
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Collection failed with exit code: $EXIT_CODE" >> "$LOG_FILE"
    exit $EXIT_CODE
fi
