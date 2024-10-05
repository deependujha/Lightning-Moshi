package main

import (
	"bytes"
	"encoding/csv"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"sync"
	"time"
)

const (
	numRequests      = 1000 // Number of total requests
	concurrencyLevel = 10 // Number of concurrent workers
)

var wg sync.WaitGroup

// BenchmarkResult stores the benchmark result for each request
type BenchmarkResult struct {
	RequestID    int
	StatusCode   int
	ResponseTime float64 // in milliseconds
}

func main() {
	// url := "http://44.203.226.39:8000/predict"
	url := "http://localhost:8000/predict"
	payload := getPayload()

	// Run benchmark
	benchmark(url, payload, numRequests, concurrencyLevel)

}

func makeApiCall(url string, jsonData []byte) (int, error) {

	// Make the POST request with JSON payload
	resp, err := http.Post(url, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return 0, err
	}
	defer resp.Body.Close() // Ensure response body is closed after the function exits

	// Read the streamed response in chunks
	buffer := make([]byte, 1024) // 1 KB buffer size
	for {
		// Read data into buffer
		n, err := resp.Body.Read(buffer)
		if n > 0 {
			// Process the data chunk (for demonstration, just print it)
			fmt.Printf("Received chunk: %x\n", buffer[:n])
		}

		if err == io.EOF {
			// End of the response stream
			break
		}
		if err != nil {
			// Handle unexpected errors during the stream
			return 0, err
		}
	}

	return 200, nil
}

func getPayload() []byte {
	payload := map[string]string{
		"field1": "deep",
	}

	// Convert the payload to JSON format
	jsonData, err := json.Marshal(payload)
	if err != nil {
		fmt.Println("Error marshaling JSON:", err)
		panic(err)
	}

	return jsonData
}

func benchmark(url string, payload []byte, numRequests, concurrencyLevel int) {
	// Channel to send requests
	reqChannel := make(chan int, numRequests)
	resultsChannel := make(chan BenchmarkResult, numRequests)

	// Track successful requests
	successCount := 0

	// add number of workers
	wg.Add(concurrencyLevel)

	// Launch workers
	for i := 0; i < concurrencyLevel; i++ {
		go worker(url, payload, reqChannel, resultsChannel)
	}

	// Record start time of the benchmark
	startTime := time.Now()

	// Send requests
	for i := 0; i < numRequests; i++ {
		reqChannel <- i
	}
	close(reqChannel)

	go func() {
		wg.Wait()
		close(resultsChannel)
	}()

	// Collect benchmark results
	var results []BenchmarkResult
	for result := range resultsChannel {
		results = append(results, result)

		// Count successful responses (e.g., status code 200)
		if result.StatusCode == 200 {
			successCount++
		}
	}

	// Record end time of the benchmark
	endTime := time.Now()
	totalBenchmarkTime := endTime.Sub(startTime).Seconds()

	// return results, totalBenchmarkTime, successCount
	// Calculate throughput
	throughput := calculateThroughput(successCount, totalBenchmarkTime)
	fmt.Printf("Throughput: %.2f requests per second\n", throughput)

	// Write results to a CSV file
	err := writeResultsToCSV(results, "benchmark_results.csv")
	if err != nil {
		log.Fatalf("Failed to write results to CSV: %v", err)
	}

	fmt.Println("Benchmark completed. Results saved to benchmark_results.csv")
}

func worker(url string, jsonData []byte, reqChannel <-chan int, resultsChannel chan<- BenchmarkResult) {
	defer wg.Done()

	for requestID := range reqChannel {
		// Start timer
		startTime := time.Now()

		statusCode, err := makeApiCall(url, jsonData)

		// Stop timer
		endTime := time.Now()

		elapsedTime := endTime.Sub(startTime).Milliseconds()

		// Handle result
		if err != nil {
			statusCode = 500 // Mark error responses with 500
			log.Printf("Request %d failed: %v", requestID, err)
		}

		// Send result to resultsChannel
		resultsChannel <- BenchmarkResult{
			RequestID:    requestID,
			StatusCode:   statusCode,
			ResponseTime: float64(elapsedTime),
		}
	}
}

// Calculate throughput based on successful requests and total benchmark time
func calculateThroughput(successCount int, totalBenchmarkTime float64) float64 {
	throughput := float64(successCount) / totalBenchmarkTime

	// save throughput to a file
	file, err := os.Create("throughput.txt")
	if err != nil {
		return throughput
	}
	defer file.Close()

	_, err = file.WriteString(fmt.Sprintf("Throughput: %.2f requests per second\n", throughput))
	if err != nil {
		log.Println("Error writing to file:", err)
		return throughput
	}
	return throughput
}

func writeResultsToCSV(results []BenchmarkResult, filename string) error {
	file, err := os.Create(filename)
	if err != nil {
		return err
	}
	defer file.Close()

	writer := csv.NewWriter(file)
	defer writer.Flush()

	// Write CSV headers
	err = writer.Write([]string{"RequestID", "StatusCode", "ResponseTime(ms)"})
	if err != nil {
		return err
	}

	// Write each benchmark result to CSV
	for _, result := range results {
		record := []string{
			fmt.Sprintf("%d", result.RequestID),
			fmt.Sprintf("%d", result.StatusCode),
			fmt.Sprintf("%.2f", result.ResponseTime),
		}
		err := writer.Write(record)
		if err != nil {
			return err
		}
	}

	return nil
}
