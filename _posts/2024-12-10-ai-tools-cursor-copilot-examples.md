---
layout: post
title: Practical Examples of Using AI Tools - Cursor and Copilot
excerpt: Real-world examples of how AI tools like Cursor and Copilot can streamline development workflows. From debugging to code generation, these tools enhance workflows for software projects.
---

This post serves as a memo summarizing a short example session for coworkers on AI tools, Cursor and Copilot.

## Background

This document presents examples of how AI tools, such as Cursor and Copilot, have provided real benefits in my open-source projects. While most of the examples focus on minor changes rather than major features, these small improvements have significantly saved time and effort—hours of work compressed into minutes.

It’s important to note that AI tools evolve rapidly. What is true of their capabilities today may be outdated tomorrow, making this document a snapshot of a particular moment in AI tool evolution.

Interaction in the examples is with Cursor. At the time of writing (12-2024), Cursor (Claude 3.5 Sonnet), compared to Copilot (GPT-4o), demonstrated a more comprehensive understanding of the entire codebase. 

The examples presented are from tasks I performed in the following projects:

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

Especially for the cases, where there is not much information available, the AI might not be able to provide a good solution.


## Learnings

* __Collaborative Assistant__
  * AI tools are best used as collaborative assistants, engaging in a dialogue rather than issuing one-time commands.
  * They excel at offering suggestions but need feedback to refine their output.

* __Iterative Refinement__
  * AI solutions often require iteration. Use feedback, examples, and corrections to steer the AI in the right direction.
  * Even if the initial response isn't perfect, it can serve as a strong starting point.

* __Detailed Prompts__
  * Providing as much information as possible in your prompt reduces ambiguity and guides the AI towards the desired solution.
  * More context minimizes guesswork and improves the relevance of the suggestions.

* __Different Answers for Same Prompts__
  * AI tools may provide varying responses to identical prompts, depending on the context, phrasing, or even timing of the interaction. Tools might have high randomness setting (temperature). 
  * This inconsistency can require additional effort to verify and refine the correct solution.

* __Unrelated Changes__
  * AI tools might make changes unrelated to the requested task. For instance, Cursor might attempt to optimize unrelated parts of the project unexpectedly.
  * To prevent this, for example, Cursor adds this automatically to fix request: If you propose a fix, please make it concise.
  * Always review the AI's output carefully to ensure it aligns with your goals.

* __AI-Created Errors and Self-Correction__
  * AI tools can introduce errors or generate non-functional code. However, they are often effective at fixing the issues they create when provided with error messages or descriptions.

* __Error Prone__
  * Every change can break any of the existing functionality. Ensure with tests that application works as expected.
  * If tests are created with AI, ensure that they are really testing what they should be testing.

* __Save Frequently__
  * Regularly save your work to create checkpoints, allowing you to revert changes if the AI reaches a state where further iterations are unproductive.
  * AI can occasionally reach a "plateau" where suggestions become ineffective or introduce significant disruptions.

* __Manage Expectations__
  * While AI isn't perfect, it significantly reduces effort on repetitive tasks and provides new ideas or insights.
  * Use it as a tool to enhance productivity rather than expecting flawless results.


__Importance of Quality Assurance When Using AI Tools__

When using AI tools to make modifications, ensuring the application keeps working as expected is extremely important. Tests and continuous testing are even more crucial than before.

* Any change can break any, even non-related, existing functionality
  * Review every change carefully to ensure it doesn't change anything else than the requested change
* Tests generated by AI might not test the right thing
  * Review tests carefully to ensure they actually cover all expected functionality

## Common Use Cases

1. __Autocomplete__
  * Oldest of the features. Intellisense on "steroids".
  * Can be used to generate code, especially good for repetitive tasks.
  * How good autocomplete is depends how context aware the tool is.
2. __Search engine__
  * Replaces traditional search engines.
  * Combines information from codebase and internet.
  * Can provide references where the information is located.
  * Can be more context aware if given enough context or used from editor.
3. __Chat-driven development__
  * Interactive code generation and problem-solving.
  * Code refactoring and optimization.
  * Bug identification and fixing.
  * Finds relevant code and other code archelogy.
  * Architecture and design discussions.

When using AI through an editor, the distinction between search and chat functionalities often blurs, as both capabilities are used with the same tool and are seamlessly integrated into the development environment.

Search example:

```
I need to store logged messages from main_logger for multiple years in an Azure service. 

We have approximately 1000 requests per day.

Based on our logging usage, which Azure service would be the most suitable for our needs?

List all the locations where we log this info in our codebase. 

Give estimate based on the actualy logging how much data we generate per day, per month and per year and how much it would cost to store it in Azure.

Provide link to the documentation where you found the information.
```

Chat example:
```
I want to configure main_logger to send logged messages to Azure Log Analytics. 

Provide me with an example and include a link to the documentation where you found the information.

If you can’t find the information, please state this clearly and do not provide a solution that might not work.
```

### Helping The AI With Good Prompts

When using AI tools, providing clear, detailed prompts is essential to guide the AI towards the desired solution.

A good prompt can make these models many times more effective than they are with lazy one-liner questions. Sometimes a good prompt can be as simple as providing the context, the expected outcome, and the constraints.

```
Bad communication: "My webapp doesn't work"
Good communication: "Application crashed on startup. This error was in console: [pasted error]"
```

A good mindset is to treat LLMs like eager junior developers who want to jump to solutions and write code without asking questions. Providing a good process guideline can help get better results. This can also help developers form better requests for LLMs.

```
Please follow this process before writing any code:

0. Role Definition: You are an AI programming assistant. Your role is to provide concise, context-aware solutions for coding tasks. Act as a thoughtful collaborator, focusing on clarity, problem-solving, and aligning with best practices.
1. Restate Requirements: Restate my requirements to ensure alignment and confirm your understanding.
2. Identify Potential Challenges: Highlight any potential challenges, edge cases, or ambiguities in the requirements that may impact the implementation.
3. Ask Questions: Ask any clarifying questions or provide observations to address assumptions or missing details.
4. Plan the Implementation:
   - Break down the task into clear, step-by-step changes.
   - Justify each step to ensure it aligns with the requirements.
   - Identify any dependencies or additional features needed for the implementation.
5. Propose a Mock API/UX (Optional): If relevant, propose an outline for APIs, UI changes, or user flows that the implementation will impact.
6. Be Concise: Keep your solution straightforward. Avoid unnecessary changes or complexity, focusing only on what's required to meet the goals.
7. Pause Before Coding: Wait for explicit approval before starting the implementation.

---

Here is the task:

User should be able to see history of previous requests. User should be able to copy used prompt to prompt window.
```

Cursor and Copilot include pre-defined system-level prompts that tell the AI what kind of behavior or output is expected. Those can be something like this:

```
“You are a helpful assistant integrated into a code editor.”

For /fix: “Analyze the provided code and fix any syntax or logical errors.”
For /tests: “Write comprehensive unit tests for the given function using the Python unittest library.”
```

Tests automatically include whole @workspace context etc.

These pre-defined prompts continue to improve over time. For example, Claude 3.5 often provides an implementation plan without being explicitly asked.

User can also provide their own global and per-project rules for AI.

> You can enhance Copilot's chat responses by providing it with contextual details about your team's workflow, tools, or project specifics. Instead of manually including this context in every chat query, you can create a custom instructions file that automatically incorporates this information with every chat request.

* [Rules for AI](https://docs.cursor.com/context/rules-for-ai)
* [Share your “Rules for AI”](https://forum.cursor.com/t/share-your-rules-for-ai/2377/1)
* [Custom instructions for GitHub Copilot in VS Code](https://code.visualstudio.com/docs/copilot/copilot-customization)

> System rules -> User rules -> Prompt

### Other Insights from The Internet

Seniors use AI to accelerate what they already know how to do.
* Rapidly prototype ideas they already understand
* Generate basic implementations they can then refine
* Explore alternative approaches to known problems
* Automate routine coding tasks
* Use AI to find information

Juniors try to use AI to learn what to do

In order to take full advantage of AI, it is important to understand the codebase and provide clear instructions to the AI. When the codebase is well architectured and common practices are followed, it is easier to get good results.

Stay modular
* Break everything into small, focused files
* Maintain clear interfaces between components
* Document your module boundaries

Source: [How AI-assisted coding will change software engineering: hard truths](https://newsletter.pragmaticengineer.com/p/how-ai-will-change-software-engineering)

## Examples

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

I mainly implemented the feature manually, but Cursor provided some good tips:

For example, I didn't have an idead how to implement decision logic which chooses correct FileAccess type:

> 💬 How should GetSupportedStorageAccess work? E.g. Blaxor WASM doesn't support FileAccess so it should return LocalStorageAccess

> 🤖 Looking at the current implementation, we should modify the system to support different storage access types. Here's how we can implement this:

```csharp
public enum StorageAccessType
{
    File,
    LocalStorage
}

public static class FileAccess 
{
    public static StorageAccessType GetSupportedStorageAccess()
    {
        // Check if running in Blazor WASM context
        if (OperatingSystem.IsBrowser())
        {
            return StorageAccessType.LocalStorage;
        }

        return StorageAccessType.File;
    }

    // ... rest of the existing code
} 
```

> 💬 For the code present, we get this error:
```
'OperatingSystem' does not contain a definition for 'IsBrowser'
```
How can I resolve this? If you propose a fix, please make it concise.

> 🤖 The error occurs because IsBrowser() is only available in .NET 7.0 and later. For broader compatibility, we can use runtime checks instead. Here's the fix:

```csharp
public static StorageAccessType GetSupportedStorageAccess()
{
    // Check if running in browser context
    if (Type.GetType("Mono.Runtime") != null && 
        AppDomain.CurrentDomain.GetAssemblies()
                .Any(a => a.GetName().Name == "WebAssembly.Net.Http"))
    {
        return StorageAccessType.LocalStorage;
    }

    return StorageAccessType.File;
}
```

Is this correct? At the moment, I don’t have any idea. The code looks good, though. (UPDATE: Nope, this doesn’t work with newer apps running on .NET 7+ since they no longer rely on Mono.)

It’s useful for fixing errors without needing to Google.

```csharp
_fileAccess = StorageAccess.GetSupportedStorageAccess() == StorageAccessType.LocalStorage 
    ? new LocalStorageAccess() 
    : new FileAccess();
```

> 💬 For the code present, we get this error:
```
Conditional expression is not valid in language version 8.0 because a common type was not found between 'LocalStorageAccess' and 'FileAccess'. To use a target-typed conversion, upgrade to language version 9.0 or greater.
```
How can I resolve this? If you propose a fix, please make it concise.

> 🤖 Let's modify the conditional operator to use explicit type casting. Here's the fix:

```csharp
_fileAccess = StorageAccess.GetSupportedStorageAccess() == StorageAccessType.LocalStorage 
    ? (IStorageAccess)new LocalStorageAccess() 
    : new FileAccess();
```

>  🤖 This explicitly casts both sides of the conditional to IStorageAccess, which resolves the common type issue in C# 8.0.

Is this a correct fix? Pretty likely, as I remember using this kind of casting in the past.

#### Conclusion

__TODO__

Curosor provied solutions and fixes, that look good, but I can't tell without further inspection if those are correct or not.

### .NET Blazor WASM - Prototype Project for Testing Local Storage Feature in JSON Flat File Data Store

With no prior experience in Blazor or WebAssembly (WASM), I set out to create a prototype project to test a requested feature for the JSON Flat File Data Store. Having previously worked with .NET view engines, latest being Razor in ASP.NET MVC 3 back in 2011, which gave me some foundational understanding of how Blazor might function.

GitHub issue: [Supporting acting as a local datastore in Blazor Wasm (Client Side)](https://github.com/ttu/json-flatfile-datastore/issues/106)


> 💬 I need an Blazor WASM application for prototyping local strorage functionality in JSON Flat File Datastore. Application could be a company information application for people who are looking and applying for new jobs. I could have a list view of companies, detailed company view and user can add events when they have contacted, applied, what is status etc. Install Datastore's reference locally from the project directory: ~/xxx/json-flatfile-datastore

> 🤖 I'll help you create a Blazor WebAssembly application for tracking job applications and company interactions using a JSON Flat File Datastore. First, let's explore what we have in the workspace and then set up the project structure.

> 🤖 First, let's create the project structure using the .NET CLI:
```$ dotnet new blazorwasm -o JobTracker```

Cursors is waiting for users approval to execute CLI commands.

> 🤖 Now, let's add the local JSON Flat File Datastore reference:
```$ cd JobTracker && dotnet add reference ~/src/github/json-flatfile-datastore/JsonFlatFileDataStore/JsonFlatFileDataStore.csproj```

Cursor provided a good explanation of what it was creating.

> 🤖 Now, I'll create the necessary models and services for our application. First, let's create the models:

> 🤖 Now, let's create a service to handle data operations using the JSON Flat File Datastore:

> 🤖 To run the application:
```sh
cd JobTracker && dotnet run
```

I clicked “Run,” but nothing happened. I opened the terminal and realized I was in the wrong directory, so I had to manually run the command.

```sh
github/blazor-prototype/JobTracker 
❯ cd JobTracker && dotnet run
cd: no such file or directory: JobTracker
```

A minor mistake from Cursor. I executed the code manually and got the site up and running.

> 💬 Create some initial information to datastore on startup if data doesn't exist in store

> 🤖 I'll help you add some initial seed data to the application when it starts up if the datastore is empty. Let's modify the CompanyService to include this functionality.

CompanyService may not be the most elegant place for this seeding functionality, but it's a good starting point.

With the seed data, an error appeared in the browser: `An unhandled error has occurred. Reload.`

I had to check the console to see further information about the error.

```sh
Microsoft.AspNetCore.Components.WebAssembly.Rendering.WebAssemblyRenderer[100]
      Unhandled exception rendering component: Cannot wait on monitors on this runtime.
System.PlatformNotSupportedException: Cannot wait on monitors on this runtime.
   at System.Threading.Monitor.ObjWait(Int32 millisecondsTimeout, Object obj)
   at System.Threading.Monitor.Wait(Object obj, Int32 millisecondsTimeout)
   at System.Threading.ManualResetEventSlim.Wait(Int32 millisecondsTimeout, CancellationToken cancellationToken)
   at System.Threading.Tasks.Task.SpinThenBlockingWait(Int32 millisecondsTimeout, CancellationToken cancellationToken)
   at System.Threading.Tasks.Task.InternalWaitCore(Int32 millisecondsTimeout, CancellationToken cancellationToken)
   at System.Threading.Tasks.Task.InternalWait(Int32 millisecondsTimeout, CancellationToken cancellationToken)
   at System.Threading.Tasks.Task.Wait(Int32 millisecondsTimeout, CancellationToken cancellationToken)
   at System.Threading.Tasks.Task.Wait()
   at JsonFlatFileDataStore.DataStore.InnerCommit(Boolean isOperationAsync, CommitAction commitAction) in /json-flatfile-datastore/JsonFlatFileDataStore/DataStore.cs:line 409
   at JsonFlatFileDataStore.DataStore.<Commit>d__39`1[[JobTracker.Models.Company, JobTracker, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null]].MoveNext() in /json-flatfile-datastore/JsonFlatFileDataStore/DataStore.cs:line 386
```

No idea what the monitors are in this context, but I guess it has something to do with BackgroundTask and BlockingCollection, which ensures that only a single thread can access the data at a time.

I gave the error to Cursor in the Flat File Data Store project:

> 🤖 The error occurs because Blazor WASM doesn't support blocking operations like Task.Wait(). Let's modify the InnerCommit method to be fully async:

Cursos solution is not usable, as I don't want to remove support for synchronous (blocking) operations.

```csharp
// Original
while (waitFlag)
{
    if (isOperationAsync)
        await Task.Delay(5).ConfigureAwait(false);
    else
        Task.Delay(5).Wait();
}

// Solution
while (waitFlag)
{
    await Task.Delay(5).ConfigureAwait(false);
}
```

I will need to instruct using only the async version of the methods in the prototype.

> 💬 Use only async methods of JSON Flat File Datastore in the application

> 🤖 I'll modify the CompanyService to use async methods throughout the application. This will improve performance and follow best practices for I/O operations.

Still got same kind of error, but from different place. This time from the CompanyService constructor:

```sh
Microsoft.AspNetCore.Components.WebAssembly.Rendering.WebAssemblyRenderer[100]
      Unhandled exception rendering component: Cannot wait on monitors on this runtime.
System.PlatformNotSupportedException: Cannot wait on monitors on this runtime.
   at System.Threading.Monitor.ObjWait(Int32 millisecondsTimeout, Object obj)
   at System.Threading.Monitor.Wait(Object obj, Int32 millisecondsTimeout)
   at System.Threading.ManualResetEventSlim.Wait(Int32 millisecondsTimeout, CancellationToken cancellationToken)
   at System.Threading.Tasks.Task.SpinThenBlockingWait(Int32 millisecondsTimeout, CancellationToken cancellationToken)
   at System.Threading.Tasks.Task.InternalWaitCore(Int32 millisecondsTimeout, CancellationToken cancellationToken)
   at System.Threading.Tasks.Task.InternalWait(Int32 millisecondsTimeout, CancellationToken cancellationToken)
   at System.Threading.Tasks.Task.Wait(Int32 millisecondsTimeout, CancellationToken cancellationToken)
   at System.Threading.Tasks.Task.Wait()
   at JobTracker.Services.CompanyService..ctor() in /blazor-prototype/JobTracker/Services/CompanyService.cs:line 18
```

Cursor was actually using .Wait() in the constructor of the CompanyService. Let’s see how Cursor can fix this.

```csharp
public CompanyService()
{
    _dataStore = new DataStore("companies.json");
    InitializeDataIfEmptyAsync().Wait();
}
```

> 💬 Got this error while starting the application: ...

> 🤖 The error occurs because we're using .Wait() in the constructor, which is not supported in WebAssembly. We need to modify the initialization approach to handle async initialization properly in Blazor WASM. Here's how we'll fix it:

Although Cursor understood why this wasn’t working in another project, it used .Wait() here. For the solution, it added some not so elegant code with semaphores. However, since this is a prototype, I’m not too picky.

> Now I can see Loading... text on screen. No list of initial companies.

> 🤖 The issue might be that we're not properly handling the async initialization in the Blazor WASM environment. Let's modify the CompanyService to ensure the data store is properly initialized and the file path is correctly handled:

> 🤖 I've completely refactored the CompanyService to use an in-memory collection instead of JSON Flat File Datastore. This approach will work better in Blazor WebAssembly because:

Now it has removed the use of the JSON Flat File Datastore and is using only in-memory data. This is not the direction I want to take. Let’s try moving the seeding to startup.

> 💬 Move seed data functionality away from service and to own class that is executed immediately on the startup

> 🤖 I'll create a separate class for seed data and modify the service and program to handle initialization properly.

Now I got this error:

```sh
System.AggregateException: One or more errors occurred. (Error reading JObject from JsonReader. Path '', line 0, position 0.)
 ---> Newtonsoft.Json.JsonReaderException: Error reading JObject from JsonReader. Path '', line 0, position 0.
   at Newtonsoft.Json.Linq.JObject.Load(JsonReader reader, JsonLoadSettings settings)
   at Newtonsoft.Json.Linq.JObject.Parse(String json, JsonLoadSettings settings)
   at Newtonsoft.Json.Linq.JObject.Parse(String json)
   at JsonFlatFileDataStore.DataStore.GetJsonObjectFromFile() in /json-flatfile-datastore/JsonFlatFileDataStore/DataStore.cs:line 441
   at JsonFlatFileDataStore.DataStore..ctor(String path, Boolean useLowerCamelCase, String keyProperty, Boolean reloadBeforeGetCollection, String encryptionKey, Boolean minifyJson) in /json-flatfile-datastore/JsonFlatFileDataStore/DataStore.cs:line 78
   at Program.<Main>$(String[] args) in /blazor-prototype/JobTracker/Program.cs:line 15
   --- End of inner exception stack trace ---
```

This was my fault, as I used an empty string as the initial data instead of an empty object in JSON Flat File Datastore.

```csharp
private string _content = string.Empty;
// Changed to this
private string _content = "{}";
```

Now the application is stuck on startup, indicating an issue with initialization. Let’s focus on getting it up and running.

> 💬 Do not wait for initialization to complete on startup and add refresh company list button to application

> I'll modify the program to start without waiting for initialization and add a refresh button to the company list.

Now I see a refresh button, but after clicking it, only a single company is displayed, even though the seed data contains multiple companies.

> 💬 Seed data has multiple companies, but in the list I can only see Tech Innovators Inc.

> The issue might be that we need to call SaveChanges() after inserting the seed data. Let's modify the SeedData class to ensure all changes are saved:

This suggested method doesn't exist.

```sh
error CS1061: 'IDataStore' does not contain a definition for 'SaveChangesAsync' and no accessible extension method 'SaveChangesAsync' accepting a first argument of type 'IDataStore' could be found (are you missing a using directive or an assembly reference?) [/blazor-prototype/JobTracker/JobTracker.csproj]
```

It seems like I’m entering the [pit of death](https://www.youtube.com/watch?v=FXjf9OQGAlY). Strange errors are starting to appear, and the code is no longer functioning as expected. Perhaps we now have a sufficient template to begin working on the JSON Flat File Data Store’s new feature manually.

#### Conclusion

Cursor successfully created a Blazor WebAssembly prototype for the JSON Flat File Data Store, but it encountered issues with threading and blocking operations.

Overall, Cursor produced a good prototype. With a few minor manual fixes, I’ll be able to start working on the feature.

### Project for Testing AI Agents (LLM Chatbot)

[AI Route Planner](https://github.com/ttu/ai-route-planner)

I created a project for testing AI agents or more likely a LLM prompting workflow. Project was created without a single manual line of code.

* Info about AI agents and LLM prompting workflows:
  * [Building effective agents](https://www.anthropic.com/research/building-effective-agents)
    * [Simon Willison's summary](https://simonwillison.net/2024/Dec/20/building-effective-agents/)

Next improvements for the project:

> 💬 Create a wait indicator. Now when user submits a prompt, he doesn't get any feedback what is happening.

> 💬 Create tests that validate that the flow of the application works. Use a mock implementation for OpenAI class. Test should check that each operation works.


## GitHub Workspaces

AI tools should be seen as collaborative assistants, similar to co-workers. They excel at providing guidance and improving your workflow through conversational interactions. While they rarely deliver a perfect solution on the first attempt, they can point you in the right direction. By refining your prompts and giving feedback, you can steer the AI to produce solutions that align more closely with your needs.

GitHub Workspaces offers a user interface that allows you to first brainstorm ideas with AI and then implement the changes. This approach combines the best of both worlds: AI-generated suggestions and human creativity and decision-making.

### RuuviTag Sensor Package - Switching from hcitool to bluetoothctl

[GitHub Issue](https://github.com/ttu/ruuvitag-sensor/issues/247)

Same as all AI solutions, GitHub Workspace benefits from all possible information provided in the initial prompt. The more detailed the prompt, the better the solution.

Including the comment:

```
Current behavior:
* No, there is no option to choose between hcitool and bluetoothctl for scanning tags with a BT 5.x device.
* The current implementation uses hcitool for Bluetooth LE communication in `ruuvitag_sensor/adapters/nix_hci.py`
* The configuration option to choose the used tool is not present in the current code.
* The get_ble_adapter function in `ruuvitag_sensor/adapters/__init__.py` does not include an option for bluetoothctl.
* To implement this feature, new communication module for bluetoothctl needs to be created and integrated similarly to hcitool in the existing code.

Proposed solution
* Yes, there is now an option to choose between hcitool and bluetoothctl for scanning tags with a BT 5.x device.
* A new communication module for bluetoothctl has been created in ruuvitag_sensor/adapters/bluetoothctl.py.
* The get_ble_adapter function in ruuvitag_sensor/adapters/__init__.py has been updated to include an option for bluetoothctl.
* A configuration option to choose the used tool has been added, allowing users to select between hcitool and bluetoothctl.
* Documentation in README.md has been updated to reflect the new configuration option and usage instructions for bluetoothctl.
```

Excluding the comment:

```
Current behavior
* No, there is no option to choose between hcitool and bluetoothctl for scanning tags with a BT 5.x device.
* The code in the ruuvitag_sensor/adapters/nix_hci.py file uses hcitool for Bluetooth LE communication on Linux.
* The ruuvitag_sensor/adapters/__init__.py file does not provide an option to switch to bluetoothctl.
* The current implementation relies on hcitool and hcidump for scanning and capturing Bluetooth LE data.
* There is no implementation or configuration for using bluetoothctl in the existing codebase.

Proposed solution
* Yes, there is now an option to choose between hcitool and bluetoothctl for scanning tags with a BT 5.x device.
* Added support for bluetoothctl in ruuvitag_sensor/adapters/nix_hci.py by creating a new class BleCommunicationBluetoothctl.
* Modified ruuvitag_sensor/adapters/__init__.py to include the new BleCommunicationBluetoothctl class and allow switching between hcitool and bluetoothctl using the RUUVI_BLE_ADAPTER environment variable.
* Updated documentation in README.md to reflect the new option for using bluetoothctl for scanning tags.
```

Current behavior is little different, but proposed solution is almost the same. The first one is more detailed and provides more information about the current state of the project.


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
* [Best practices for prompt engineering with the OpenAI API](https://help.openai.com/en/articles/6654000-best-practices-for-prompt-engineering-with-the-openai-api)
* [Getting started with AI: Good enough prompting](https://www.oneusefulthing.org/p/getting-started-with-ai-good-enough)
* [Building effective agents](https://www.anthropic.com/research/building-effective-agents)
* [How AI-assisted coding will change software engineering: hard truths](https://newsletter.pragmaticengineer.com/p/how-ai-will-change-software-engineering)
* [How I program with LLMs](https://crawshaw.io/blog/programming-with-llms)

## Conclusion

AI tools like Cursor, Copilot, and ChatGPT are powerful assistants that enhance productivity by simplifying tasks like code generation, debugging, and documentation. While not perfect, they significantly reduce effort on repetitive tasks, allowing developers to focus on higher-level work. As these tools evolve, their impact on software development will only grow, making them valuable allies in modern workflows.