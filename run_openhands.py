#!/usr/bin/env python3
"""
Start the OpenHands autonomous engineer.

Prerequisites (already satisfied in the repo):
- Docker & docker‑compose installed
- docker‑compose.yml contains the OpenHands service (see earlier)

Running this script will:
1. Bring up the OpenHands container (docker compose up -d openhands)
2. Wait until the health‑check reports “healthy”
3. Print the UI address (http://localhost:3000)
4. Keep the process alive so you can Ctrl‑C to stop both the script and the container.
"""

import subprocess
import sys
import time
from pathlib import Path

DOCKER_COMPOSE = Path(__file__).parent / "docker-compose.yml"
SERVICE_NAME = "openhands"
UI_URL = "http://localhost:3000"


def run_cmd(cmd: list[str]) -> subprocess.CompletedProcess:
    """Run a command, capturing stdout/stderr together."""
    return subprocess.run(
        cmd,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        check=False,
    )


def start_container() -> None:
    print("🚀 Starting OpenHands via docker‑compose …")
    result = run_cmd(["docker", "compose", "-f", str(DOCKER_COMPOSE), "up", "-d", SERVICE_NAME])
    if result.returncode:
        sys.exit(f"❌ docker compose failed:\n{result.stdout}")


def wait_for_healthy(timeout: int = 120) -> None:
    """Poll the container health status until it becomes healthy."""
    end = time.time() + timeout
    while time.time() < end:
        status = run_cmd(["docker", "inspect", "--format={{.State.Health.Status}}", SERVICE_NAME])
        if status.stdout.strip() == "healthy":
            print("✅ OpenHands is healthy")
            return
        print("⏳ waiting for health …", end="\r")
        time.sleep(2)
    sys.exit("❌ OpenHands did not become healthy within the timeout.")


def stop_container() -> None:
    print("\n🛑 Stopping OpenHands …")
    run_cmd(["docker", "compose", "-f", str(DOCKER_COMPOSE), "down"])


def main() -> None:
    try:
        start_container()
        wait_for_healthy()
        print(f"\n🌐 OpenHands UI available at: {UI_URL}")
        print("Press Ctrl‑C to shut down.")
        while True:
            time.sleep(3600)  # keep alive
    except KeyboardInterrupt:
        pass
    finally:
        stop_container()


if __name__ == "__main__":
    main()
