# Copyright The Lightning AI team.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
import os

# COLOR CODES
RESET = "\u001b[0m"
RED = "\u001b[31m"
GREEN = "\u001b[32m"
BLUE = "\u001b[34m"
MAGENTA = "\u001b[35m"
BG_MAGENTA = "\u001b[45m"

# ACTION CODES
BOLD = "\u001b[1m"
UNDERLINE = "\u001b[4m"
INFO = f"{BOLD}{BLUE}[INFO]"
WARNING = f"{BOLD}{RED}[WARNING]"


PROTOBUF_TEMPLATE = """syntax = "proto3";

package litserver_grpc;

// LitServe service definitions
service LitServe {
    // for server-side streaming, change this to `rpc Predict (Request) returns (stream Response) {}`
    rpc Predict (Request) returns (Response) {}
}

// The request message containing expected input type
message Request {
}

// The response message containing the output type
message Response {
    string message = 1;
}
"""

# Link our documentation as the bottom of this msg
SUCCESS_PROTOBUF_MSG = """
{BOLD}{MAGENTA}protobuf file created successfully at{RESET} {UNDERLINE}{protobuf_file_path}{RESET}
{BOLD}{BLUE}Follow the instructions below to generate code for your proto file:{RESET}

- To generate grpc server code, run:
{BOLD}{MAGENTA}
python -m grpc_tools.protoc -I. --python_out=. --pyi_out=. --grpc_python_out=. litserve.proto
{RESET}

- In case of any error, make sure you have `grpcio-tools` installed. {MAGENTA}pip install grpcio-tools{RESET}
"""

def generate_protobuf_file():
    """Create template protobuf file that is required for grpc server.
    """

    # os.makedirs("proto", exist_ok=True)

    with open("litserve.proto", "w") as f:
        f.write(PROTOBUF_TEMPLATE)

    success_msg = SUCCESS_PROTOBUF_MSG.format(
        protobuf_file_path=os.path.abspath("litserve.proto"),
        BOLD=BOLD,
        MAGENTA=MAGENTA,
        GREEN=GREEN,
        BLUE=BLUE,
        UNDERLINE=UNDERLINE,
        BG_MAGENTA=BG_MAGENTA,
        RESET=RESET,
    )
    print(success_msg)

