# Technical reference

[Documentation home](README.md) · [Configuration](configuration.md) · [Firmware](firmware.md)

This page collects details that are useful for unusual configurations but are not needed for a normal preset-based setup.

## Profiles and GameID

BlueRetro always has a global configuration. Supported loaders can also send a GameID, allowing a separate profile for the running game. Start the game first, disconnect controllers, connect Web Config, then switch the active profile to that GameID before saving changes.

The adapter filesystem supports a maximum of 16 files. Four are normally system files, leaving room for up to 12 additional GameID configurations. The limit is related to runtime memory rather than flash capacity.

## Mapping fields

| Field | Meaning |
| --- | --- |
| From | Button or axis read from the Bluetooth controller |
| To | Button or axis sent to the console |
| Player / destination ID | Console output that receives the mapped input |
| Maximum | Axis scale, or the value produced when mapping a button to an axis |
| Threshold | Axis position required before an axis-to-button mapping activates |
| Deadzone | Neutral area around an axis center |
| Turbo | On/off timing based on console polling frames |
| Scaling | Response curve; passthrough and linear are the practical options |

The selected source and destination label sets only make button names easier to read. They do not change or save controller behavior by themselves.

## Turbo

Turbo timing is expressed as active frames over a repeating frame window. For example, `2/4` holds the input for two frames and releases it for two. A `1/x` pulse may be too short for games that filter single-frame presses.

## Adapter inquiry and stored pairings

- Automatic inquiry starts when no controller is connected and is shown by a pulsing status LED.
- Manual inquiry must be started with the adapter button.
- BlueRetro can retain up to 16 Bluetooth Classic keys and 16 BLE keys.

Physical-button timing differs between external adapters and some internal installations. For a typical external adapter:

| Hold time | Action |
| --- | --- |
| Under 3 seconds | Stop inquiry, or disconnect active Bluetooth devices |
| 3–6 seconds | Start inquiry |
| 6–10 seconds | Reset configuration |
| 30 seconds | Restore factory firmware and reset configuration |

Use the hardware vendor's instructions if an internal installation handles the console reset button differently.

## Status LED

| State | Meaning |
| --- | --- |
| Pulsing | Inquiry is active for a new controller |
| Off | No firmware error and inquiry is inactive |
| Solid | Firmware error; power-cycle and collect a device trace if it returns |

## Memory behavior

N64 Controller Pak and Dreamcast VMU emulation share a limited flash-backed memory system. Back up save data before reformatting it for another console. N64 exposes four banks; Dreamcast exposes one VMU image.

## System actions

- **Restart** reboots the adapter.
- **Sleep** disables it until power is cycled.
- **Factory reset** restores the original shipped firmware and clears configuration.

Source material: [BlueRetro main wiki](https://github.com/darthcloud/BlueRetro/wiki), [Web Config manual](https://github.com/darthcloud/BlueRetro/wiki/BlueRetro-BLE-Web-Config-User-Manual), and [controller pairing guide](https://github.com/darthcloud/BlueRetro/wiki/Controller-pairing-guide).
