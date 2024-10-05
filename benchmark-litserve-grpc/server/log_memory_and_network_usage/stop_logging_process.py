# stop_logging_process.py
import os
import signal

# Read the PID of the logging process from the file
with open("logging_pid.txt", "r") as f:
    pid = int(f.read().strip())

# Kill the process
os.kill(pid, signal.SIGTERM)

print(f"Logging process with PID {pid} stopped.")
