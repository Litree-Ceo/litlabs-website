#!/bin/bash
# Shutdown protection - prevents accidental shutdown/reboot by agents
# Run this once: bash protect_shutdown.sh

echo "=== Protecting system from accidental shutdown ==="

# Create aliases that block dangerous commands
SH_BLOCK='#!/bin/bash
echo "BLOCKED: shutdown/reboot disabled for agent safety."
echo "To override, run: sudo /sbin/shutdown"
exit 1'

# Write protected wrappers
sudo tee /usr/local/bin/shutdown <<< "$SH_BLOCK" >/dev/null
sudo tee /usr/local/bin/poweroff <<< "$SH_BLOCK" >/dev/null
sudo tee /usr/local/bin/reboot <<< "$SH_BLOCK" >/dev/null
sudo tee /usr/local/bin/halt <<< "$SH_BLOCK" >/dev/null
sudo tee /usr/local/bin/init <<< "$SH_BLOCK" >/dev/null
sudo chmod +x /usr/local/bin/{shutdown,poweroff,reboot,halt,init}

# Ensure /usr/local/bin is before /sbin in PATH for all users
if ! grep -q 'PATH=.*/usr/local/bin.*:/sbin' /etc/profile; then
    echo 'export PATH="/usr/local/bin:$PATH"' | sudo tee /etc/profile.d/safe-path.sh >/dev/null
fi

echo "Done. From now on, any agent calling shutdown/poweroff/reboot will be BLOCKED."
echo "To actually reboot: sudo /sbin/reboot"
