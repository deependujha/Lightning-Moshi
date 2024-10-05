package server

import (
	"bytes"
	"fmt"
	"io"

	"github.com/gofiber/fiber/v2"
)

// type Restaurant struct {
// 	Name         string
// 	RestaurantId string        `bson:"restaurant_id,omitempty"`
// 	Cuisine      string        `bson:"cuisine,omitempty"`
// 	Address      interface{}   `bson:"address,omitempty"`
// 	Borough      string        `bson:"borough,omitempty"`
// 	Grades       []interface{} `bson:"grades,omitempty"`
// }

func (s *FiberServer) RegisterFiberRoutes() {
	s.App.Get("/", s.HelloWorldHandler)

	s.App.Get("/health", s.healthHandler)
	// s.App.Get("/meow", s.dummyMeowHandler)
	s.App.Post("/getResponse", s.getResponseHandler)

}

func (s *FiberServer) HelloWorldHandler(c *fiber.Ctx) error {
	resp := fiber.Map{
		"message": "Hello World",
	}

	return c.JSON(resp)
}

func (s *FiberServer) healthHandler(c *fiber.Ctx) error {
	return c.JSON(s.db.Health())
}

// func (s *FiberServer) dummyMeowHandler(c *fiber.Ctx) error {
// 	coll := s.db.Database("sample_restaurants").Collection("restaurants")
// 	newRestaurant := Restaurant{Name: "8282", Cuisine: "Korean"}
// 	result, err := coll.InsertOne(context.TODO(), newRestaurant)
// 	if err != nil {
// 		panic(err)
// 	}
// 	fmt.Println(result.InsertedID)
// 	return c.JSON(result)
// }

func (s *FiberServer) getResponseHandler(c *fiber.Ctx) error {
	// Parse the multipart form data
	file, err := c.FormFile("audio")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Failed to parse audio file",
		})
	}

	// Instead of directly passing the file, open it
	openedFile, err := file.Open()
	if err != nil {
		panic("error occurred in opening file: " + err.Error())
	}

	defer openedFile.Close()

	// Read the file into a byte buffer
	var buf bytes.Buffer
	_, err = io.Copy(&buf, openedFile)
	if err != nil {
		panic("error occurred in reading file: " + err.Error())
	}

	// Get the byte slice of the audio file
	audioData := buf.Bytes()

	// Send the audio data to the gRPC server
	res, err := s.grpcClient.Predict(audioData)
	if err != nil {
		panic("error occurred in sending to gRPC: " + err.Error())
	}
	fmt.Printf("res: %s", res)
	// inspec res (if it actually contains the moshi model response)

	// 	// Create destination directory if it doesn't exist
	// 	if _, err := os.Stat("./uploads"); os.IsNotExist(err) {
	// 		err = os.Mkdir("./uploads", os.ModePerm)
	// 		if err != nil {
	// 			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
	// 				"error": "Could not create upload directory",
	// 			})
	// 		}
	// 	}

	// 	// Save the uploaded file to a specific path
	// 	filePath := fmt.Sprintf("./uploads/%s", file.Filename)
	// 	if err := c.SaveFile(file, filePath); err != nil {
	// 		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
	// 			"error": file"Could not save audio file",
	// 		})
	// 	}

	return c.JSON(fiber.Map{
		"message": "File uploaded successfully",
		"file":    file.Filename,
	})

}
