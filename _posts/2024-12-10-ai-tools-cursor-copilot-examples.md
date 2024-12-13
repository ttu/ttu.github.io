---
layout: post
title: Practical Examples of Using AI Tools - Cursor and Copilot
excerpt: Real-world examples of how AI tools like Cursor and Copilot can streamline development workflows. From debugging to code generation, these tools enhance workflows for software projects.
---

This post serves as a memo summarizing a short example session for coworkers on AI tools, Cursor and Copilot.

## Background

This document presents examples of how AI tools, such as Cursor and Copilot, have provided real benefits in my open-source projects. While most of the examples focus on minor changes rather than major features, these small improvements have significantly saved time and effort—hours of work compressed into minutes.

It’s important to note that AI tools evolve rapidly. What is true of their capabilities today may be outdated tomorrow, making this document a snapshot of a particular moment in AI tool evolution.

The examples presented are from real tasks I performed in the following projects:

1. [Python - RuuviTag Sensor Package](https://github.com/ttu/ruuvitag-sensor)
* `ruuvitag-sensor` is a Python package for communicating with RuuviTag BLE Sensor and for decoding measurement data from broadcasted BLE data.

2. [C# - JSON Flat File Data Store](https://github.com/ttu/json-flatfile-datastore)
* A lightweight, JSON-based data storage solution, ideal for small applications and prototypes requiring simple, file-based storage.

3. [C# - Fake JSON Server](https://github.com/ttu/dotnet-fake-json-server)
* Fake JSON Server is a Fake REST API that can be used as a Back End for prototyping or as a template for a CRUD Back End. Fake JSON Server also has an experimental GraphQL query and mutation support.

## Common Problems With Tools

* __Difficulty in Finding Relevant Code__
  * AI suggestions may sometimes lack precision, providing irrelevant code snippets that do not align with the context of the problem.
* __Providing Suboptimal or Incorrect Solutions__
  * The tools might suggest solutions that are inefficient, incomplete, or incorrect for the task at hand.
* __Hallucinations and Misinformation__
  * __Nonexistent Features:__ The AI might reference features or functionality that do not exist in the codebase or framework.
  * __Fabricated Content:__ It may generate plausible-sounding but entirely incorrect or fabricated information.
* __Difference in Answers__
  * The tools may provide different answers for the same prompt, leading to confusion about the correct solution. E.g. Cursor gave different answer from Chat and from Compose, all gave a different answers for the same prompt on different times etc.

## Examples

Interaction is with Cursor. At the time of writin (12-2024), Cursor, compared to Copilot, demonstrated a more comprehensive understanding of the entire codebase. However, given the rapid pace of AI tool development, this advantage may no longer hold true in the near future.

### Fake JSON Server - Documentation Update

```sh
git clone https://github.com/ttu/dotnet-fake-json-server/
git checkout d818f0280037d04da2717662f420dc1e821ebf12
```

> 💬 Single object operations are missing from the README. Add those there.

> 🤖 To add single object operations to the README, we can create a new section that describes how to interact with single objects in the API. This section will include examples for GET, PUT, PATCH, and DELETE operations. Here's how you can structure it:

The answer had some strange points, such as thinking that the URL didn’t contain any ID. However, the examples were correct.

```md
Note: Single objects differ from collections in that they:
- Don't support POST operations (will return 409 Conflict)
- Don't require IDs in the URL
- Return 400 Bad Request if trying to treat them as collections
```

> 💬 {object} in url is the id

> 🤖 I'll add documentation for single object operations to the README.md, clarifying that {object} is the id. This should be added after the collection operations section (around line 1161):

The documentation was fairly good, but in the chat window, it was quite disorganized.

> 💬 give documentation in single markdown block

> 🤖 Here's the complete single object operations documentation in one markdown block:

#### Conclusion

Cursor created a decent solution. While it requires some modifications, it significantly simplifies the process of writing the documentation.

### Fake JSON Server - Code Style Configuration Update

```sh
git clone https://github.com/ttu/dotnet-fake-json-server/
git checkout c9750108d4953e0290224dac3f04bf03cfe7c96b
```

> 💬 Update .editorconfig to match the codebase

After executing `dotnet format`, I noticed that the only change across multiple files was on the first line, so mainly config was correct.

> 💬 There is now change in all files after format. something to do with the start of the file. How to fix it?

Cursor couldn't come up with a correct solution, so I checked the changes with `git diff` and made a new prompt:

> 💬 change is like this. how to fix .editorconfig so this won't happen? what has changed in this file?
```sh
diff --git a/FakeServer/Startup.cs b/FakeServer/Startup.cs
index 45681d8..a239b5a 100644
--- a/FakeServer/Startup.cs
+++ b/FakeServer/Startup.cs
@@ -1,4 +1,4 @@
-using FakeServer.Authentication;
+using FakeServer.Authentication;
 using FakeServer.Authentication.Jwt;
 using FakeServer.Common;
 using FakeServer.Common.Formatters;
```

Then Cursor figured out the solution:

> 🤖 Looking at the diff, it shows a change in line endings at the start of the file. The content is identical but the line ending character has changed. To fix this in .editorconfig, we need to be more specific about line endings and BOM (Byte Order Mark).
Here's the updated .editorconfig configuration:

I asked also for a more information about BOM:

> 💬 what is this: charset = utf-8-bom

#### Conclusion

I had tried to create this configuration manually few years ago, but it took too much time to finish. Overall, Cursor's soltion was a good. I had to request some improvements, which were provided.

### Fake JSON Server - Update project from .NET6 -> .NET8

```sh
git clone https://github.com/ttu/dotnet-fake-json-server/
git checkout master
```

> 👤 Upgrade the project to .NET8

Cursor identified project files, CI configuration files, the Dockerfile, and package references that needed updating. It also suggested an update to the CHANGELOG.md.

I knew that there is more to update, so  I requested additional suggestions:

> 💬 Is there a mention about framework version in any other documentation that would require updating?

Cursor identified release script files that should be updated but did not find any other documentation requiring updates.

> 🤖 The README.md doesn't explicitly mention the .NET version, so it doesn't need updating. The docs/index.html is just for documentation rendering and doesn't contain version information.

README has a version info, so had to point it out.

> 💬 README has the version info.

> 🤖 Yes, I found a version reference in the README.md that needs to be updated. The example version number is shown in line 210: E.g. download and execute version _0.11.0_ for _macOS_

Cursor found something entirely different, so I had to specify the exact location.

> 💬 No here: ...

> 🤖 Thank you for pointing that out. Here's how you can update the README.md to reflect the upgrade to .NET 8:

#### Conclusion

Overall, extremely helpful. After a few attempts, it found all the necessary files except the README. Without prior knowledge of what needed updating, some updates might have been missed.

### Fake JSON Server - Tests Failed After Update to .NET8

Cursor didn’t mention about required update when asked how to upgrade the project.

```sh
git clone https://github.com/ttu/dotnet-fake-json-server/
git checkout master
```

After upgrading the project files to .NET 8, I encountered an error in a test and provided it to Cursor:

> 💬 when upgrading the project to .net8 i got this error from test: System.ArgumentOutOfRangeException : IDX10720: Unable to create KeyedHashAlgorithm for algorithm 'HS256', the key size must be greater than: '256' bits, key has '216' bits. (Parameter 'keyBytes')

Cursor gave a correct solution:

> 🤖 This error occurs because in .NET 8, the JWT security requirements have been strengthened and now require a minimum key size of 256 bits (32 bytes) for HMAC SHA-256 (HS256) algorithm. Looking at the code, the issue is in the TokenConfiguration class where a hardcoded secret key is used.

Cursor provided the location of the problematic code and suggested a couple of different options for the fix.

```csharp
// secretKey contains a secret passphrase only your server knows
private static string _secretKey = "mysupersecret_secretkey!123";

private static SymmetricSecurityKey _signingKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_secretKey));
```

```csharp
private static string _secretKey = "mysupersecret_secretkey!123_longer_key_32bytes";
```

#### Conclusion

A good solution. It identified the problem and provided the correct fix. Saved me time and effort.

### JSON Flat File Data Store - Fixing an DateTime Serialization Issue

> 💬 How would fix this issue? https://github.com/ttu/json-flatfile-datastore/issues/105

Cursor’s response and the provided solution were to some other issue.

> 🤖 Let me help analyze and fix the issue with the IsUpdating property not working correctly when disposing of the DataStore.
The issue occurs because the IsUpdating property only checks if there are pending updates in the queue or if there's an executing update, but doesn't properly wait for all updates to complete during disposal.

I had to point out that the issue was related to DateTime serialization.

> 💬 No. Issue is: DateTimeOffset gets converted to local (while DateTime doesn't)

> 🤖 Ah, I understand the issue now. The problem is with the JSON serialization of DateTimeOffset values, where they're being converted to local time during serialization while DateTime values maintain their original format.

Cursor provided a correct solution:

```csharp
private readonly JsonSerializerSettings _serializerSettings = new JsonSerializerSettings() 
{ 
    ContractResolver = new CamelCasePropertyNamesContractResolver(),
    DateTimeZoneHandling = DateTimeZoneHandling.Utc,
    DateParseHandling = DateParseHandling.DateTimeOffset
};
```

It also provided a test to verify the fix.

```csharp
[Fact]
public async Task DateTimeOffset_MaintainsOffset()
{
    var newFilePath = UTHelpers.Up();
    var store = new DataStore(newFilePath);
    var collection = store.GetCollection("dates");

    var utcDate = DateTimeOffset.UtcNow;
    var localDate = DateTimeOffset.Now;
    
    await collection.InsertOneAsync(new { 
        id = 1, 
        utcDate = utcDate,
        localDate = localDate 
    });

    var store2 = new DataStore(newFilePath);
    var collection2 = store.GetCollection("dates");
    var item = collection2.AsQueryable().First();

    Assert.Equal(utcDate, item.utcDate);
    Assert.Equal(localDate, item.localDate);
    Assert.Equal(utcDate.Offset, ((DateTimeOffset)item.utcDate).Offset);
    Assert.Equal(localDate.Offset, ((DateTimeOffset)item.localDate).Offset);

    UTHelpers.Down(newFilePath);
}
```

#### Conclusion

After the initial hallucination, Cursor identified the correct place to apply the fix and provided a test to verify it.

I’m not entirely sure how I want this to work, so I need to think it through before implementing the fix.


### RuuviTag Sensor Package - New Feature Implementation

RuuviTags had a functionality implemented years ago, where it stores measurement data to tag's internal memory. It can be downloaded, but I hadn't had time to check the documentation how it can be done, how Python can handle connections, data downloading, or data parsing.

```sh
git clone https://github.com/ttu/ruuvitag-sensor
git checkout master
```

#### 1st Attempt

> 💬 Create functionality to ruuvi.py that downloads history data from ruuvitags

The first time, Cursor immediately provided the correct solution, even with limited context.

> 🤖 I'll help you add functionality to download history data from RuuviTag. RuuviTags with firmware version 3.30.0 and newer support accessing history data through GATT connections. I'll add this functionality to the RuuviTagSensor class.

```py
# Add these constants after the existing imports
RUUVI_HISTORY_SERVICE_UUID = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E"
RUUVI_HISTORY_TX_CHAR_UUID = "6E400003-B5A3-F393-E0A9-E50E24DCCA9E"
RUUVI_HISTORY_RX_CHAR_UUID = "6E400002-B5A3-F393-E0A9-E50E24DCCA9E"

# Add these methods to the RuuviTagSensor class
@staticmethod
async def get_history_async(mac: str, start_time: Optional[datetime] = None) -> List[SensorData]:
    """
    Get history data from a RuuviTag that supports it (firmware 3.30.0+)
    
    Args:
        mac (str): MAC address of the RuuviTag
        start_time (datetime, optional): Start time for history data. If None, gets all available data
        
    Returns:
        List[SensorData]: List of historical sensor readings
    """
    throw_if_not_async_adapter(ble)
    
    history_data = []
    try:
        # Connect to the device
        device = await ble.connect_gatt(mac)
        
        # Get the history service
        history_service = await device.get_service(RUUVI_HISTORY_SERVICE_UUID)
        if not history_service:
            raise RuntimeError(f"History service not found for device {mac}")
            
        # Get characteristics
        tx_char = await history_service.get_characteristic(RUUVI_HISTORY_TX_CHAR_UUID)
        rx_char = await history_service.get_characteristic(RUUVI_HISTORY_RX_CHAR_UUID)
        
        if not tx_char or not rx_char:
            raise RuntimeError("Required characteristics not found")
        
        # Enable notifications
        await device.start_notify(tx_char, lambda _, data: history_data.append(data))
        
        # Request history data
        command = b"\x26"  # Get logged history command
        if start_time:
            timestamp = int(start_time.timestamp())
            command += struct.pack("<I", timestamp)
            
        await rx_char.write_value(command)
        
        # Wait for data collection (implement proper waiting mechanism)
        await asyncio.sleep(2)
        
        # Parse collected data
        parsed_data = []
        for data_point in history_data:
            timestamp = struct.unpack("<I", data_point[0:4])[0]
            measurement = RuuviTagSensor._parse_history_data(data_point[4:])
            if measurement:
                measurement['timestamp'] = datetime.fromtimestamp(timestamp)
                parsed_data.append(measurement)
        
        return parsed_data
        
    finally:
        if 'device' in locals():
            await device.disconnect()

@staticmethod
def _parse_history_data(data: bytes) -> Optional[SensorData]:
    """
    Parse history data point from RuuviTag
    
    Args:
        data (bytes): Raw history data point
        
    Returns:
        Optional[SensorData]: Parsed sensor data or None if parsing fails
    """
    try:
        temperature = struct.unpack("<h", data[0:2])[0] * 0.005
        humidity = struct.unpack("<H", data[2:4])[0] * 0.0025
        pressure = struct.unpack("<H", data[4:6])[0] + 50000
        
        return {
            'temperature': temperature,
            'humidity': humidity,
            'pressure': pressure,
            'data_format': 5  # History data uses similar format to data format 5
        }
    except Exception as e:
        log.error(f"Failed to parse history data: {e}")
        return None
```

Cursor implemented the functionality in the wrong class, so I asked it to move the functionality to the BLE adapter class.

> 💬 Move most of the functionality to bleak_ble file

> 🤖 I'll help you move the history-related functionality to the bleak_ble.py adapter file, which is more appropriate since it handles the BLE communication details.

There were a few hallucinations. Cursor incorrectly assumed that there was a function in BleakClient to get a service by UUID. 

```py
# Original
history_service = await client.get_service(RUUVI_HISTORY_SERVICE_UUID)

# Corrected
services = await client.get_services()
history_service = next(
    (service for service in services if service.uuid.lower() == RUUVI_HISTORY_SERVICE_UUID.lower()),
    None,
)
```

The second hallucination involved the existence of async versions of the get_characteristic functions.

```py
# Original
tx_char = await history_service.get_characteristic(RUUVI_HISTORY_TX_CHAR_UUID)
rx_char = await history_service.get_characteristic(RUUVI_HISTORY_RX_CHAR_UUID)

# Corrected
tx_char = history_service.get_characteristic(RUUVI_HISTORY_TX_CHAR_UUID)
rx_char = history_service.get_characteristic(RUUVI_HISTORY_RX_CHAR_UUID)
```
After pointing out that such functions do not exist, Cursor provided a correct solution.

The third “mistake” was that the code used MAC addresses, whereas macOS relies on device UUIDs. I manually made some changes, e.g. removed MAC validation and added an example test file.

```py
if not re.match("[0-9A-F]{2}(:[0-9A-F]{2}){5}$", mac.upper()):
    raise ValueError(f"Invalid MAC address: {mac}")
```

Overall, the code was functional and I could connect to the RuuviTag and download the data after a few minor corrections.

#### 2nd Attempt

On the second attempt to create the same functionality, Cursor didn’t understand that we wanted to use built-in functionality, so the solution was instead based on the functionality of the current package.

> 🤖 The methods will collect sensor data at regular intervals and store them with timestamps. The data is returned as a dictionary where: ...

I had to point out that RuuviTags have internal memory that can be accessed.

> 💬 History data can be downloaded from ruuvitags internal memory

> 🤖 I apologize for my previous response. You're correct - RuuviTags actually have internal memory that can store historical data, and we should access that directly rather than collecting data over time. Let me modify the code to properly download the history from the RuuviTag's internal memory.

Solution looked good, but it would be better to provide a more detailed prompt from the start.

#### 3rd Attempt

> 💬 Create functionality to that downloads history data from ruuvitags internal memory. Documentation for the functionality is provided here. Add support to all adapters. https://docs.ruuvi.com/communication/bluetooth-connection/nordic-uart-service-nus/log-read

> 🤖 I'll help you create functionality to download history data from RuuviTag's internal memory. First, let me read the existing code to understand the current structure and then implement the new functionality.

The solution provided, based on the documentation, included not only downloading the data but also clearing the internal data and configuring the logging interval.

```py
LOG_READ_CMD = bytes.fromhex("0100")
LOG_CLEAR_CMD = bytes.fromhex("0200")
LOG_CONFIG_CMD = bytes.fromhex("03")

@staticmethod
async def clear_history_data(mac: str, bt_device: str = "") -> bool:
    """Clear history data from RuuviTag using Nordic UART Service"""
    device = await BleakScanner.find_device_by_address(mac, adapter=bt_device or None)
    if not device:
        raise RuntimeError(f"Device with address {mac} not found")

    async with BleakClient(device) as client:
        # Send clear command
        await client.write_gatt_char(NUS_RX_CHAR_UUID, LOG_CLEAR_CMD)
        return True

@staticmethod
async def configure_logging(mac: str, interval_seconds: int = 600, bt_device: str = "") -> bool:
    """Configure logging settings using Nordic UART Service"""
    device = await BleakScanner.find_device_by_address(mac, adapter=bt_device or None)
    if not device:
        raise RuntimeError(f"Device with address {mac} not found")

    async with BleakClient(device) as client:
        # Convert interval to bytes (little-endian)
        interval_bytes = interval_seconds.to_bytes(2, byteorder='little')
        config_cmd = LOG_CONFIG_CMD + interval_bytes
        
        # Send configuration command
        await client.write_gatt_char(NUS_RX_CHAR_UUID, config_cmd)
        return True
```

Functionality didn't use class's `_get_scanner` method, but used `BleakScanner` directly.

Additionally, it failed to add operations to other adapters and incorrectly claimed that the Bleson adapter doesn’t support async operations. Furthermore, it didn’t attempt to add the functionality to the base class of the non-async adapter; instead, it added functions with NotImplementedError to the child class.

> 💬 add example under examples directory

Cursor provided a fairly thorough example with inputs and all necessary details. While it didn’t follow the simple format used in other example-files, it was still correct.

```py
#!/usr/bin/env python3

"""
Example script demonstrating how to download history data from RuuviTags.
This example works with both macOS (using system UUIDs) and other platforms (using MAC addresses).

Note: This functionality requires the Bleak adapter (default) and async operations.
"""

import asyncio
import logging
import sys
from typing import Dict

from ruuvitag_sensor.ruuvi import RuuviTagSensor
from ruuvitag_sensor.ruuvi_types import SensorData


async def find_tags() -> Dict[str, SensorData]:
    """Find all RuuviTags and print their identifiers"""
    print("Scanning for RuuviTags...")
    tags = await RuuviTagSensor.find_ruuvitags_async()
    
    print("\nFound tags:")
    for identifier, data in tags.items():
        print(f"Device identifier: {identifier}")
        print(f"Current data: {data}\n")
    
    return tags


async def download_history(identifier: str) -> None:
    """
    Download and print history data from a RuuviTag
    
    Args:
        identifier: On macOS, this is a system-specific UUID (e.g., "E5A782E4-B0DB-4953-A1D8-9CB1E52E3C73")
                  On other platforms, this is a MAC address (e.g., "AA:BB:CC:DD:EE:FF")
    """
    print(f"\nDownloading history for device {identifier}...")
    try:
        # Configure logging to collect data every 5 minutes
        success = await RuuviTagSensor.configure_logging(identifier, interval_seconds=300)
        if success:
            print("Logging configured successfully")
        
        # Download history data
        history = await RuuviTagSensor.get_history_data(identifier)
        print(f"\nFound {len(history)} history entries:")
        for entry in history:
            print(f"Entry: {entry}")
        
        # Optionally clear history after downloading
        if input("\nDo you want to clear history? (y/N): ").lower() == 'y':
            success = await RuuviTagSensor.clear_history_data(identifier)
            if success:
                print("History cleared successfully")
            
    except Exception as e:
        print(f"Error: {e}")


async def main():
    """Main example workflow"""
    # Enable debug logging
    logging.basicConfig(level=logging.INFO)
    
    print("RuuviTag History Download Example")
    print("=================================")
    print("Note: On macOS, device identifiers are system-specific UUIDs")
    print("     On other platforms, device identifiers are MAC addresses")
    print()
    
    # First find available tags
    tags = await find_tags()
    
    if not tags:
        print("No RuuviTags found!")
        sys.exit(1)
    
    # Ask user which tag to use
    print("\nAvailable identifiers:")
    for i, identifier in enumerate(tags.keys(), 1):
        print(f"{i}. {identifier}")
    
    try:
        choice = int(input("\nEnter number of device to download history from (or 0 to exit): "))
        if choice == 0:
            return
        if 1 <= choice <= len(tags):
            identifier = list(tags.keys())[choice - 1]
            await download_history(identifier)
        else:
            print("Invalid choice!")
    except ValueError:
        print("Invalid input!")


if __name__ == "__main__":
    # Run the async example
    asyncio.run(main())
```

#### Conclusion

I was extremely impressed with Cursor’s handling of this functionality. After just a few minor corrections for hallucinations, I was able to establish a connection to the RuuviTag, download the data, and parse it. This really saved lots of time and effort.

When I provided a link to the documentation, Cursor even added functionality that I hadn’t known existed.

### JSON Flat File Data Store - Support for Using Local Storage with Blazor WASM

__TODO__

### .NET Blazor WASM - Prototype Project for Testing Local Storage Feature in JSON Flat File Data Store

With no prior experience in Blazor or WebAssembly (WASM), I set out to create a prototype project to test a requested feature for the JSON Flat File Data Store. Having previously worked with .NET view engines, latest being Razor in ASP.NET MVC 3 back in 2011, which gave me some foundational understanding of how Blazor might function.

GitHub issue: [Supporting acting as a local datastore in Blazor Wasm (Client Side)](https://github.com/ttu/json-flatfile-datastore/issues/106)

__TODO__

## GitHub Workspaces

AI tools should be seen as collaborative assistants, similar to co-workers. They excel at providing guidance and improving your workflow through conversational interactions. While they rarely deliver a perfect solution on the first attempt, they can point you in the right direction. By refining your prompts and giving feedback, you can steer the AI to produce solutions that align more closely with your needs.

GitHub Workspaces offers a user interface that allows you to first brainstorm ideas with AI and then implement the changes. This approach combines the best of both worlds: AI-generated suggestions and human creativity and decision-making.

TODO: List example Issues to be solved

## ChatGPT - Enhancing Documentation, Blog Writing, and More

- From idea to complete text
  - AI tools can help transform a rough idea into a fully fleshed-out text.
  - They assist in structuring content, ensuring logical flow, and filling in details.

- Summarize text
  - AI tools can condense lengthy texts into concise summaries.
  - This is useful if have a lot of information and need to distill it down to the essentials.

- Make text more understandable
  - AI tools can simplify complex language and jargon.
  - They help in making the content accessible to a broader audience.

- Proofread
  - AI tools can identify and correct grammatical errors, typos, and punctuation mistakes.
  - They ensure the text is polished and professional.

- Check correctness of technical concepts
  - AI tools can verify the accuracy of information and concepts.
  - They help in maintaining factual correctness and consistency in the content.

## Links

* [Copilot](https://copilot.github.com/)
* [Cursor](https://cursor.ai/)
* [ChatGPT](https://chat.openai.com/)


## Conclusion

AI tools like Cursor, Copilot, and ChatGPT are powerful assistants that enhance productivity by simplifying tasks like code generation, debugging, and documentation. While not perfect, they significantly reduce effort on repetitive tasks, allowing developers to focus on higher-level work. As these tools evolve, their impact on software development will only grow, making them valuable allies in modern workflows.