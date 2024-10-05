package grpc_codes

import (
	"context"
	litserve_grpc "go-backend-audio/proto"
	"log"
	"time"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

type GRPCClient struct {
	*grpc.ClientConn
	LitServeClient litserve_grpc.LitServeClient
}

func NewGRPCClient() *GRPCClient {

	conn, err := grpc.NewClient("localhost:8000", grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		panic(err)
	}
	log.Println("connected to grpc server")

	c := litserve_grpc.NewLitServeClient(conn)

	return &GRPCClient{
		ClientConn:     conn,
		LitServeClient: c,
	}

}

func (g *GRPCClient) Predict(audio []byte) (*litserve_grpc.Response, error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*100)
	defer cancel()

	req := &litserve_grpc.Request{
		Audio: audio,
	}
	res, err := g.LitServeClient.Predict(ctx, req)
	if err != nil {
		return nil, err
	}
	return res, nil
}
