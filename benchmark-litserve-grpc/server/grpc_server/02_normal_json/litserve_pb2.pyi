from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from typing import ClassVar as _ClassVar, Optional as _Optional

DESCRIPTOR: _descriptor.FileDescriptor

class Request(_message.Message):
    __slots__ = ("field1", "field2", "field3", "field4", "field5")
    FIELD1_FIELD_NUMBER: _ClassVar[int]
    FIELD2_FIELD_NUMBER: _ClassVar[int]
    FIELD3_FIELD_NUMBER: _ClassVar[int]
    FIELD4_FIELD_NUMBER: _ClassVar[int]
    FIELD5_FIELD_NUMBER: _ClassVar[int]
    field1: str
    field2: str
    field3: str
    field4: str
    field5: str
    def __init__(self, field1: _Optional[str] = ..., field2: _Optional[str] = ..., field3: _Optional[str] = ..., field4: _Optional[str] = ..., field5: _Optional[str] = ...) -> None: ...

class Response(_message.Message):
    __slots__ = ("field1", "field2", "field3", "field4", "field5")
    FIELD1_FIELD_NUMBER: _ClassVar[int]
    FIELD2_FIELD_NUMBER: _ClassVar[int]
    FIELD3_FIELD_NUMBER: _ClassVar[int]
    FIELD4_FIELD_NUMBER: _ClassVar[int]
    FIELD5_FIELD_NUMBER: _ClassVar[int]
    field1: str
    field2: str
    field3: str
    field4: str
    field5: str
    def __init__(self, field1: _Optional[str] = ..., field2: _Optional[str] = ..., field3: _Optional[str] = ..., field4: _Optional[str] = ..., field5: _Optional[str] = ...) -> None: ...
