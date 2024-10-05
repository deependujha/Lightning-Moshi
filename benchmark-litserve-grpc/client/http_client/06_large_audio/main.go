package main

import (
	"bytes"
	"encoding/csv"
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"os"
	"sync"
	"time"
)

const (
	numRequests      = 1000 // Number of total requests
	concurrencyLevel = 50   // Number of concurrent workers
)

var wg sync.WaitGroup

// BenchmarkResult stores the benchmark result for each request
type BenchmarkResult struct {
	RequestID    int
	StatusCode   int
	ResponseTime float64 // in milliseconds
}

func main() {
	url := "http://44.203.226.39:8000/predict"
	// Run benchmark
	benchmark(url, numRequests, concurrencyLevel)
}

func makeApiCall(url string) (int, error) {

	requestBody, multipartWriter := getPayload()
	multipartWriter.Close()

	// Create the POST request
	req, err := http.NewRequest("POST", url, &requestBody)
	if err != nil {
		fmt.Println("Error creating POST request:", err)
		return 0, err
	}

	// Set the Content-Type header to multipart/form-data with the boundary
	req.Header.Set("Content-Type", multipartWriter.FormDataContentType())

	// Execute the request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("Error making POST request:", err)
		return 0, err
	}
	defer resp.Body.Close()

	return resp.StatusCode, nil

}

func getPayload() (bytes.Buffer, *multipart.Writer) {
	// Create a new buffer to hold the multipart form data
	var requestBody bytes.Buffer
	multipartWriter := multipart.NewWriter(&requestBody)
	defer multipartWriter.Close()

	// Add audio file to the form data
	audioFilePath := "nature.mp3" // Replace with actual file path
	audioFile, err := os.Open(audioFilePath)
	if err != nil {
		log.Fatal("Error opening audio file:", err)
	}
	defer audioFile.Close()

	// Add image file to the form data
	audioWriter, err := multipartWriter.CreateFormFile("audio", "audio.mp3")
	if err != nil {
		log.Fatal("Error writing audio file to form:", err)
	}
	_, err = io.Copy(audioWriter, audioFile)
	if err != nil {
		log.Fatal("Error copying audio file:", err)
	}

	// Close the multipart writer to finalize the form data
	return requestBody, multipartWriter
}

func benchmark(url string, numRequests, concurrencyLevel int) {
	// Channel to send requests
	reqChannel := make(chan int, numRequests)
	resultsChannel := make(chan BenchmarkResult, numRequests)

	// Track successful requests
	successCount := 0

	// add number of workers
	wg.Add(concurrencyLevel)

	// Launch workers
	for i := 0; i < concurrencyLevel; i++ {
		go worker(url, reqChannel, resultsChannel)
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

func worker(url string, reqChannel <-chan int, resultsChannel chan<- BenchmarkResult) {
	defer wg.Done()

	for requestID := range reqChannel {
		// Start timer
		startTime := time.Now()

		statusCode, err := makeApiCall(url)

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
