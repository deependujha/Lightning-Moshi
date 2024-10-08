// Code generated by protoc-gen-go-grpc. DO NOT EDIT.
// versions:
// - protoc-gen-go-grpc v1.5.1
// - protoc             v4.25.3
// source: proto/litserve.proto

package litserve_grpc

import (
	context "context"
	grpc "google.golang.org/grpc"
	codes "google.golang.org/grpc/codes"
	status "google.golang.org/grpc/status"
)

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
// Requires gRPC-Go v1.64.0 or later.
const _ = grpc.SupportPackageIsVersion9

const (
	LitServe_Predict_FullMethodName = "/litserver_grpc.LitServe/Predict"
)

// LitServeClient is the client API for LitServe service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
//
// LitServe service definitions
type LitServeClient interface {
	// for server-side streaming, change this to `rpc Predict (Request) returns (stream Response) {}`
	Predict(ctx context.Context, in *Request, opts ...grpc.CallOption) (*Response, error)
}

type litServeClient struct {
	cc grpc.ClientConnInterface
}

func NewLitServeClient(cc grpc.ClientConnInterface) LitServeClient {
	return &litServeClient{cc}
}

func (c *litServeClient) Predict(ctx context.Context, in *Request, opts ...grpc.CallOption) (*Response, error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	out := new(Response)
	err := c.cc.Invoke(ctx, LitServe_Predict_FullMethodName, in, out, cOpts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// LitServeServer is the server API for LitServe service.
// All implementations must embed UnimplementedLitServeServer
// for forward compatibility.
//
// LitServe service definitions
type LitServeServer interface {
	// for server-side streaming, change this to `rpc Predict (Request) returns (stream Response) {}`
	Predict(context.Context, *Request) (*Response, error)
	mustEmbedUnimplementedLitServeServer()
}

// UnimplementedLitServeServer must be embedded to have
// forward compatible implementations.
//
// NOTE: this should be embedded by value instead of pointer to avoid a nil
// pointer dereference when methods are called.
type UnimplementedLitServeServer struct{}

func (UnimplementedLitServeServer) Predict(context.Context, *Request) (*Response, error) {
	return nil, status.Errorf(codes.Unimplemented, "method Predict not implemented")
}
func (UnimplementedLitServeServer) mustEmbedUnimplementedLitServeServer() {}
func (UnimplementedLitServeServer) testEmbeddedByValue()                  {}

// UnsafeLitServeServer may be embedded to opt out of forward compatibility for this service.
// Use of this interface is not recommended, as added methods to LitServeServer will
// result in compilation errors.
type UnsafeLitServeServer interface {
	mustEmbedUnimplementedLitServeServer()
}

func RegisterLitServeServer(s grpc.ServiceRegistrar, srv LitServeServer) {
	// If the following call pancis, it indicates UnimplementedLitServeServer was
	// embedded by pointer and is nil.  This will cause panics if an
	// unimplemented method is ever invoked, so we test this at initialization
	// time to prevent it from happening at runtime later due to I/O.
	if t, ok := srv.(interface{ testEmbeddedByValue() }); ok {
		t.testEmbeddedByValue()
	}
	s.RegisterService(&LitServe_ServiceDesc, srv)
}

func _LitServe_Predict_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(Request)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(LitServeServer).Predict(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: LitServe_Predict_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(LitServeServer).Predict(ctx, req.(*Request))
	}
	return interceptor(ctx, in, info, handler)
}

// LitServe_ServiceDesc is the grpc.ServiceDesc for LitServe service.
// It's only intended for direct use with grpc.RegisterService,
// and not to be introspected or modified (even as a copy)
var LitServe_ServiceDesc = grpc.ServiceDesc{
	ServiceName: "litserver_grpc.LitServe",
	HandlerType: (*LitServeServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "Predict",
			Handler:    _LitServe_Predict_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "proto/litserve.proto",
}
