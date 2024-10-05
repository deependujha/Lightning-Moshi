package database

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	_ "github.com/joho/godotenv/autoload"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Service interface {
	Health() map[string]string
	Database(name string) *mongo.Database
}

type service struct {
	db *mongo.Client
}

var (
	host = os.Getenv("DB_HOST")
	port = os.Getenv("DB_PORT")
	//database = os.Getenv("DB_DATABASE")
)

func New() Service {
	// MongoDBAtlasConnectionString := "mongodb+srv://<username>:<password>@cluster0.c6damlj.mongodb.net/"
	MongoDBLocalConnectionString := fmt.Sprintf("mongodb://%s:%s", host, port)
	client, err := mongo.Connect(context.Background(), options.Client().ApplyURI(MongoDBLocalConnectionString))

	if err != nil {
		log.Fatal(err)

	}
	// defer func() {
	// 	if err := client.Disconnect(context.TODO()); err != nil {
	// 		panic(err)
	// 	}
	// }()

	fmt.Println("Connected to MongoDB")
	return &service{
		db: client,
	}
}

func (s *service) Health() map[string]string {
	ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)
	defer cancel()

	err := s.db.Ping(ctx, nil)
	if err != nil {
		log.Fatalf("db down: %v", err)
	}

	return map[string]string{
		"message": "It's healthy",
	}
}

func (s *service) Database(name string) *mongo.Database {
	return s.db.Database(name)
}
