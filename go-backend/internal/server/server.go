package server

import (
	"go-backend-audio/internal/database"
	grpc_codes "go-backend-audio/internal/grpc_client"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

type FiberServer struct {
	*fiber.App
	db         database.Service
	grpcClient *grpc_codes.GRPCClient
}

func New() *FiberServer {
	server := &FiberServer{
		App: fiber.New(fiber.Config{
			ServerHeader: "go-backend-audio",
			AppName:      "go-backend-audio",
		}),

		db:         database.New(),
		grpcClient: grpc_codes.NewGRPCClient(),
	}
	server.App.Use(cors.New())

	return server
}
