#!/bin/bash
# =============================================================================
# LiTTree Lab Studios - System Brain (SAFE VERSION)
# Runs as litbit user. Read-only monitoring. No git commits. No root ops.
# Sends alerts to Discord webhook or falls back to local log only.
# =============================================================================
# Usage:
#   Direct:  bash ~/LiTTreeLabstudios/agents/system-brain/brain.sh
#   Cron (as litbit, NOT root):
#     */5 * * * * /bin/bash /home/litbit/LiTTreeLabstudios/agents/system-brain/brain.sh
#
# Config via ~/.config/littree/brain.env:
#   DISCORD_SYSTEM_WEBHOOK=https://discord.com/api/webhooks/...
#   DISCORD_ALERTS_WEBHOOK=https://discord.com/api/webhooks/...
#   MONITOR_PC_IP=192.168.0.77
#   ALERT_THRESHOLD_DISK=85
#   ALERT_THRESHOLD_MEM=90
# =============================================================================

set -euo pipefail

CONFIG_FILE="${HOME}/.config/littree/brain.env"
LOG_DIR="${HOME}/.local/share/littree/brain-logs"
LOG_FILE="${LOG_DIR}/brain-$(date +%Y%m%d).log"
STATE_FILE="${HOME}/.local/share/littree/brain-state.json"

DISCORD_SYSTEM_WEBHOOK="${DISCORD_SYSTEM_WEBHOOK:-}"
DISCORD_ALERTS_WEBHOOK="${DISCORD_ALERTS_WEBHOOK:-}"
MONITOR_PC_IP="${MONITOR_PC_IP:-192.168.0.77}"
ALERT_THRESHOLD_DISK="${ALERT_THRESHOLD_DISK:-85}"
ALERT_THRESHOLD_MEM="${ALERT_THRESHOLD_MEM:-90}"

if [[ -f "$CONFIG_FILE" ]]; then source "$CONFIG_FILE"; fi

mkdir -p "$LOG_DIR" "$(dirname "$STATE_FILE")"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] [$1] ${*:2}" | tee -a "$LOG_FILE"; }

find "$LOG_DIR" -name "brain-*.log" -mtime +7 -delete 2>/dev/null || true

discord_send() {
  local color="$1" title="$2" msg="$3"
  local webhook="${DISCORD_ALERTS_WEBHOOK:-$DISCORD_SYSTEM_WEBHOOK}"
  [[ -z "$webhook" ]] && { log "WARN" "No Discord webhook - alert skipped: $title"; return 0; }
  local payload="{\"embeds\":[{\"title\":\"$title\",\"description\":\"$msg\",\"color\":$color,\"footer\":{\"text\":\"LiTTree Brain - $(date '+%Y-%m-%d %H:%M:%S')\"}}]}"
  curl -s -X POST -A "DiscordBot (litlabs.net, 1.0)" -H "Content-Type: application/json" -d "$payload" "$webhook" --max-time 10 >/dev/null 2>&1 \
    || log "WARN" "Discord POST failed: $title"
}
alert() { discord_send "15548997" "$1" "$2"; }   # red
ok()    { discord_send "5763719"  "$1" "$2"; }   # green

declare -A LAST_ALERT=()
STATE_JSON=""
if [[ -f "$STATE_FILE" ]]; then STATE_JSON=$(cat "$STATE_FILE" 2>/dev/null || echo "{}"); fi

get_last() { echo "$STATE_JSON" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('last_alert',{}).get('$1',0))" 2>/dev/null || echo 0; }

should_alert() {
  local key="$1" now
  now=$(date +%s)
  local last; last=$(get_last "$key")
  if (( now - last > 1800 )); then
    LAST_ALERT["$key"]="$now"
    return 0
  fi
  return 1
}

save_state() {
  local pairs=""
  for k in "${!LAST_ALERT[@]}"; do pairs="$pairs\"$k\":${LAST_ALERT[$k]},"; done
  echo "{\"last_run\":$(date +%s),\"last_alert\":{${pairs%,}}}" > "$STATE_FILE"
}

check_disk() {
  local usage; usage=$(df / 2>/dev/null | awk 'NR==2 {gsub(/%/,"",$5); print $5}') || return
  log "INFO" "Disk /: ${usage}%"
  if (( usage > ALERT_THRESHOLD_DISK )) && should_alert "disk_high"; then
    alert "WARNING High Disk" "Termux /data at **${usage}%** - clean logs or node_modules"
  fi
}

check_memory() {
  local total used pct
  read -r total used <<< "$(free -m 2>/dev/null | awk 'NR==2 {print $2, $3}')" || return
  pct=$(( used * 100 / total ))
  log "INFO" "Memory: ${used}MB/${total}MB (${pct}%)"
  if (( pct > ALERT_THRESHOLD_MEM )) && should_alert "mem_high"; then
    alert "WARNING High Memory" "Memory at **${pct}%** (${used}/${total}MB)"
  fi
}

check_website() {
  local code; code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "https://litlabs.net" 2>/dev/null) || code="000"
  log "INFO" "litlabs.net: HTTP $code"
  if [[ "$code" != "200" ]] && should_alert "site_down"; then
    alert "SITE DOWN" "litlabs.net returned **HTTP $code**"
  fi
}

check_pc() {
  if ping -c 1 -W 3 "$MONITOR_PC_IP" >/dev/null 2>&1; then
    log "INFO" "PC ($MONITOR_PC_IP): reachable"
    LAST_ALERT["pc_offline"]=0
    if nc -z -w3 "$MONITOR_PC_IP" 22 2>/dev/null; then
      log "INFO" "PC SSH port 22: open"
      LAST_ALERT["ssh_down"]=0
    else
      log "WARN" "PC SSH port 22: closed"
      if should_alert "ssh_down"; then
        alert "SSH DOWN" "Monolith ($MONITOR_PC_IP) pingable but SSH port 22 closed - restart sshd"
      fi
    fi
  else
    log "WARN" "PC ($MONITOR_PC_IP): unreachable"
    if should_alert "pc_offline"; then
      alert "PC OFFLINE" "Monolith ($MONITOR_PC_IP) not responding to ping"
    fi
  fi
}

check_cloudflared() {
  if pgrep -f "cloudflared tunnel" >/dev/null 2>&1; then
    log "INFO" "cloudflared: running"
    LAST_ALERT["cloudflared_down"]=0
  else
    log "WARN" "cloudflared: NOT running"
    if should_alert "cloudflared_down"; then
      alert "CLOUDFLARED DOWN" "cloudflared not running on Termux - tunnels may be offline"
    fi
  fi
}

main() {
  log "INFO" "=== Brain Cycle Start ==="
  check_disk
  check_memory
  check_website
  check_pc
  check_cloudflared
  save_state
  log "INFO" "=== Brain Cycle Complete ==="
}

main