# Pair a controller

[Documentation home](README.md) · [Configuration](configuration.md) · [Firmware](firmware.md)

## Normal pairing

1. Disconnect the Web Config and turn off any controller already connected to BlueRetro.
2. Confirm that BlueRetro is in inquiry mode. Its status LED should pulse.
3. Put the controller into the supported Bluetooth mode shown in the table below, then start its pairing mode.
4. Wait for the controller lights to settle. Test its buttons on the console.

BlueRetro normally enters inquiry mode automatically when no controller is connected. If inquiry was changed to manual, use the adapter's pairing button or temporarily change **Controller setup → Adapter → Pairing mode** back to automatic.

After the first pairing, power on the controller normally. BlueRetro stores pairing keys and should reconnect without repeating the pairing sequence.

## ModRetro M64 Pro

The M64 Pro requires the [M64 support firmware](https://github.com/rainthefrog/BlueRetroForever/releases/tag/M64_Support). That beta is based on [bherdm/BlueRetroForever](https://github.com/bherdm/BlueRetroForever), the active continuation of the archived BlueRetro project, and adds BLE Secure Connections pairing, N64-specific input mapping, and Rumble Pak output.

1. Install a battery pack and hold **Start** for about one second to power on the controller.
2. Put BlueRetro into inquiry mode.
3. Hold **C-Up + Start** on the M64 Pro. Its top LED blinks rapidly while pairing.
4. Wait for the controller and BlueRetro LEDs to settle.

For later connections, hold **Start** for about one second. The controller remembers only its most recently paired device, so pairing it with another host requires pairing it with BlueRetro again.

M64 support has been verified on an HW1 N64 adapter. Other BlueRetro hardware and console targets remain untested. To use its built-in vibration, select **Rumble Pak** for the player under **Controller setup → Console ports**.

## Common controller families

| Controller family | Start pairing | Reconnect |
| --- | --- | --- |
| PlayStation 4 / 5 | Hold **Share/Create + PS** until the light flashes | Press **PS** |
| Xbox One S / Series / Adaptive | Power on, then hold the controller's sync button | Hold **Xbox** briefly |
| Nintendo Switch controllers | Hold the sync button until the player lights animate | Press a button twice |
| Wii Remote / Wii U Pro | Press the red **Sync** button; `1 + 2` pairing is not supported | Press any button |
| Most 8BitDo controllers | Use **XInput** mode, then hold sync | Press **Start** |
| Retro-Bit Bluetooth | Use **XInput** mode (`Home + X`) | Press **Home** |
| Retro Fighters Brawler64 | Hold sync until the lights animate | Press a button |
| Sony PS3 | Requires writing the BlueRetro Bluetooth address to an official controller over USB | Press **PS** |

## Tested controller table

The mode matters: several controllers expose different Bluetooth identities and layouts depending on how they are powered on.

| Controller | Required mode | Mapping label / preset |
| --- | --- | --- |
| **ModRetro M64 Pro** | BLE with M64 support firmware | N64 / Default Gamepad |
| 8BitDo GBros Adapter | XInput | GameCube / Default Gamepad |
| 8BitDo M30 Bluetooth | XInput | Saturn / Default Gamepad |
| 8BitDo N30 Arcade Stick | XInput | Xbox / Default Gamepad |
| 8BitDo N64 | HID Generic | N64 / Default Gamepad |
| 8BitDo N64 Modkit | S mode | Switch N64 / Default Gamepad |
| 8BitDo NGC Modkit | Android mode | GameCube / Default Gamepad |
| 8BitDo NeoGeo Gamepad | Bluetooth | NeoGeo / Default Gamepad |
| 8BitDo SF30 Pro | XInput | SN30/SF30 / Default Gamepad |
| 8BitDo S30 or N30 Modkit | XInput | Saturn or NES / Default Gamepad |
| 8BitDo Ultimate | Bluetooth | Switch Pro / Default Gamepad |
| Atari VCS Classic or Modern | HID Generic | Xbox / Default Gamepad |
| Google Stadia | HID Generic | Default / Default Gamepad |
| Exlene GameCube | Switch | Switch Pro / Default Gamepad |
| Hyperkin Admiral N64 | Switch | N64 / Default Gamepad |
| Xbox Adaptive, One S, or Series | Bluetooth | Xbox / Default Gamepad |
| Switch NES, SNES, Genesis, or N64 | Switch | Matching Switch controller / Default Gamepad |
| Switch Joy-Con pair | Switch | Left and Right Joy-Con Upright presets |
| Switch Pro | Switch | Switch Pro / Default Gamepad |
| Wii Remote and extensions | Wii | Matching Wii controller / Default Gamepad |
| Wii U Pro | Wii | Switch Pro / Default Gamepad |
| PowerA GameCube | Switch | Switch Pro / Default Gamepad |
| Retro-Bit Saturn Bluetooth | XInput | Saturn / Default Gamepad |
| Retro Fighters Brawler64 | Switch | Switch N64 / Default Gamepad |
| Retro Fighters Warrior Adapter | XInput | GameCube / Default Gamepad |
| Sony DualShock 3 / Sixaxis | PS3 | PS3 / Default Gamepad |
| Sony DualShock 4 / DualSense | PS4 / PS5 | PS4/PS5 / Default Gamepad |
| Steam Controller | BLE Lizard mode | Keyboard & Mouse / Steam Controller preset |

## Special cases

### Dual Joy-Con

Apply the **Switch Left Joy-Con Upright** preset to player 1 and **Switch Right Joy-Con Upright** to player 2. Pair the left Joy-Con first, then the right.

### 8BitDo

Update the controller first and use the mode listed above. If its D-pad behaves like an analog stick, change the controller's own D-pad mode using its manual before changing BlueRetro mappings.

### PlayStation 3

Only official PS3 controllers are supported. Connect Web Config to read the BlueRetro Bluetooth address, then use a Sixaxis pairing tool over USB to set that address as the controller's master. This is an exceptional setup; it is not performed by Web Bluetooth.

### Keyboard PIN

Older Bluetooth keyboards may ask for a PIN. Enter `0000` on the keyboard and press Enter.

## If pairing fails

- Make sure the Web Config is disconnected; configuration and controller connections compete for the adapter.
- Confirm the adapter LED is pulsing before starting controller pairing.
- Verify the controller's required mode and update its firmware.
- Remove or forget the controller from the previous host, then retry.
- Power-cycle both devices if a saved pairing is stale.
- For M64 Pro, confirm the adapter is running the M64 support firmware and repeat **C-Up + Start**.

Source material: [BlueRetro controller pairing guide](https://github.com/darthcloud/BlueRetro/wiki/Controller-pairing-guide), [BlueRetroForever](https://github.com/bherdm/BlueRetroForever), [M64 support release](https://github.com/rainthefrog/BlueRetroForever/releases/tag/M64_Support), and [M64 Pro wireless operation](https://support.modretro.com/en_us/m64-pro-controller-wireless-operation-SJ4YZInQzg).
