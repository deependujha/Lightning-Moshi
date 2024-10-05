# run_logging_process.py
import sys
import subprocess

server_process_id = sys.argv[1]
print(f"Server process ID: {server_process_id}")

# Start the logging process
logging_process = subprocess.Popen(["python", "log_usage.py", server_process_id])

# Save the process ID (PID) to a file so you can stop it later
with open("logging_pid.txt", "w") as f:
    f.write(str(logging_process.pid))

print(f"Logging process started with PID: {logging_process.pid}")
