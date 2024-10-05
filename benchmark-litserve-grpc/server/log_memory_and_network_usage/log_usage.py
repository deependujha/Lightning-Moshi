# log_usage.py
import time
import csv
import psutil
import os
import sys

server_process_id = sys.argv[2]
print(f"Server process ID: {server_process_id}")

def log_usage(filepath):
    """Logs memory and network usage every second."""
    with open(filepath, 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(["Time", "Memory_Usage_MB", "Network_Sent_MB", "Network_Received_MB"])

        process = psutil.Process(int(server_process_id))
        net_io_start = psutil.net_io_counters()

        while True:
            memory_usage = process.memory_info().rss / (1024 * 1024)  # Memory usage in MB
            net_io = psutil.net_io_counters()

            sent_mb = (net_io.bytes_sent - net_io_start.bytes_sent) / (1024 * 1024)  # MB sent
            recv_mb = (net_io.bytes_recv - net_io_start.bytes_recv) / (1024 * 1024)  # MB received

            writer.writerow([time.strftime("%H:%M:%S"), memory_usage, sent_mb, recv_mb])
            file.flush()  # Ensure data is written to the file
            time.sleep(1)

if __name__ == "__main__":
    log_file = "usage_log.csv"
    log_usage(log_file)
