# beamctl-mx-ring

A Logi Options+ plugin that controls a Logitech Litra Beam LX light from the Actions Ring of a Logitech MX Master 4: switch the light on and off, change brightness and colour temperature with the scroll wheel, pick a colour for the RGB backlight, and apply saved presets.

The plugin does not talk to the light itself. Every action runs **[beamctl](https://github.com/nenych/beamctl)**, a command-line tool that communicates with the Litra Beam LX over Bluetooth or USB, so beamctl has to be installed:

```
Actions Ring  →  beamctl-mx-ring  →  beamctl  →  Litra Beam LX
```

It has been used with an MX Master 4; Logi Options+ offers the Actions Ring on other MX devices as well. beamctl-mx-ring is an independent open-source project and is not made by Logitech.

## What the bubbles do

| | Action | What it does |
|:-:|---|---|
| <img src="docs/toggle.svg" width="48" alt=""> | **Toggle Light** | Click to turn the main (front) light on or off. |
| <img src="docs/brightness.svg" width="48" alt=""> | **Brightness** | Point at the bubble and roll the scroll wheel to make the main light brighter or dimmer. |
| <img src="docs/temperature.svg" width="48" alt=""> | **Temperature** | Point at the bubble and roll the scroll wheel to make the light warmer (more yellow) or cooler (more blue), anywhere between 2700 K and 6500 K. |
| <img src="docs/back_toggle.svg" width="48" alt=""> | **Toggle Back Light** | Click to turn the coloured glow on the back of the light on or off. |
| <img src="docs/back_brightness.svg" width="48" alt=""> | **Back Brightness** | Point at the bubble and roll the scroll wheel to make the back glow stronger or weaker. |
| <img src="docs/back_color.svg" width="48" alt=""> | **Back Color** | Click to open the system colour picker. Choose a colour and press OK: the back light switches to it and turns on. Cancel leaves everything as it was. |
| | **Preset: _name_** | Click to apply a saved look in one go, for example brightness and temperature for video calls. You get one such action for every preset you define (see [Presets](#presets)). |

Good to know:

- Bubbles whose icon shows a small mouse are the ones you adjust with the wheel; the others react to a click.
- Adjusting brightness or temperature does not switch the light on. If it is off, the new value is kept and used the next time you turn it on.
- Over Bluetooth every change takes a fraction of a second to reach the light, so fast scrolling arrives in a few larger steps. Over USB it is instant.

## Install

You need macOS or Windows, Logi Options+ 2.2 or newer and, to build the plugin, Node.js 22 or newer. There is no Linux version: Logi Options+ does not exist for Linux, although beamctl itself works there.

Building this project requires the Logitech Actions SDK. Use of the Logitech SDK is subject to Logitech’s applicable developer terms.

1. **Install beamctl** by following [its README](https://github.com/nenych/beamctl#install), and check that `beamctl status` prints the state of your light. The plugin looks for the binary in `~/.local/bin`, `/opt/homebrew/bin`, `/usr/local/bin` and `~/go/bin`, in that order, and then on `PATH`. On Windows `~` is your user folder, so `go install` puts `beamctl.exe` where the plugin finds it.

2. **Build and load the plugin:**

   ```
   git clone https://github.com/nenych/beamctl-mx-ring.git
   cd beamctl-mx-ring
   npm install
   npm run build
   npm run link
   ```

   `npm run link` adds the plugin to Logi Options+ and reloads it. `npm run unlink` removes it again.

## Set up the ring

1. Open **Logi Options+** and click the **Actions Ring** icon in the top menu.
2. In the **Layout** menu on the left, click **CUSTOMIZE RING**.
3. In the list of actions on the right, find the **Beamctl** plugin.
4. Drag an action onto one of the eight bubbles. Repeat for every action you want in the ring.
5. Close the customisation screen and open the ring: on an MX Master 4 press the Haptic Sense Panel under your thumb; on other devices assign the **Actions Ring** action to a button first.

Using it:

- **Click** a bubble to run a toggle, the colour picker or a preset.
- For **Brightness**, **Temperature** and **Back Brightness**, move the pointer over the bubble and roll the scroll wheel or the thumb wheel. You can also click the bubble and drag to the right to get a slider.

## Presets

A preset is a named combination of settings, stored by beamctl in `~/.config/beamctl/presets.json` (`%USERPROFILE%\.config\beamctl\presets.json` on Windows):

```json
{
  "call":  {"brightness": 60, "temp": 4500},
  "night": {"brightness": 20, "temp": 2700, "back": {"color": "ff6a00", "brightness": 40}}
}
```

With this file the plugin offers two extra actions, **Preset: call** and **Preset: night**. The format is described in the [beamctl README](https://github.com/nenych/beamctl#presets). After adding or renaming a preset run `npm run link` again so the plugin picks up the new list.

## If something does not work

- Run `beamctl status` in a terminal. If that fails, the problem is between beamctl and the light, not in the plugin.
- Look at the plugin log. On macOS it is `~/Library/Application Support/Logi/LogiPluginService/Logs/plugin_logs/Beamctl.log`.

## Contributing

Contributions are welcome, see [CONTRIBUTING.md](CONTRIBUTING.md). `npm run build:pack` creates an `.lplug4` package.

## Licence and trademarks

MIT, see [LICENSE](LICENSE). Third-party code bundled into the plugin package is listed in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

This project is not affiliated with, sponsored or endorsed by Logitech. Logitech, Logi, and their logos are trademarks or registered trademarks of Logitech Europe S.A. and/or its affiliates in the United States and/or other countries.
