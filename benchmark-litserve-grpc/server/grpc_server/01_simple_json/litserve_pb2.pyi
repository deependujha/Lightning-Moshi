from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from typing import ClassVar as _ClassVar, Optional as _Optional

DESCRIPTOR: _descriptor.FileDescriptor

class Request(_message.Message):
    __slots__ = ("field1",)
    FIELD1_FIELD_NUMBER: _ClassVar[int]
    field1: str
    def __init__(self, field1: _Optional[str] = ...) -> None: ...

class Response(_message.Message):
    __slots__ = ("field1",)
    FIELD1_FIELD_NUMBER: _ClassVar[int]
    field1: str
    def __init__(self, field1: _Optional[str] = ...) -> None: ...
