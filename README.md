# beamctl-mx-ring

Logi Options+ plugin for controlling a Logitech Litra Beam LX light from the Actions Ring (MX Master 4 and other MX devices).

It is a thin wrapper: every action runs the `beamctl` CLI.

## Requirements

- `beamctl` installed in one of `~/.local/bin`, `/opt/homebrew/bin`, `/usr/local/bin` or `~/go/bin` (checked in that order)
- Logi Options+ 2.2 or newer (Node.js plugins on macOS)
- Node.js 22 or newer to build

## Build and load

```
npm install
npm run build
npm run link
```

`link` symlinks `dist/` into the Logi Plugin Service and reloads the plugin; run it again after changing presets. `npm run unlink` removes it. `npm run build:pack` creates an `.lplug4` package.

Then assign the actions of the "Beamctl" plugin in Logi Options+ → Actions Ring → Configure.

## Actions

| Action | Type | Runs |
|---|---|---|
| Toggle Light | command | `beamctl toggle` |
| Toggle Back Light | command | `beamctl back toggle` |
| Back Color | command | `beamctl back pick` |
| Brightness | adjustment | `beamctl brightness ±N`, 3.5 % per tick |
| Temperature | adjustment | `beamctl temp ±N`, 70 K per tick |
| Back Brightness | adjustment | `beamctl back brightness ±N`, 3.5 % per tick |
| Preset: *name* | command | `beamctl preset <name>`, one per preset in `~/.config/beamctl/presets.json` |

Adjustments respond to the scroll wheel while the pointer is over the bubble. Ticks add up, and the light is sent whole percent and whole 100 K steps.

Plugin logs: `~/Library/Application Support/Logi/LogiPluginService/Logs/plugin_logs/Beamctl.log`.

## Contributing

Contributions are welcome, see [CONTRIBUTING.md](CONTRIBUTING.md).

## Licence and trademarks

MIT, see [LICENSE](LICENSE). Third-party code bundled into the plugin package is listed in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

This project is not affiliated with, sponsored or endorsed by Logitech. Logitech, Logi, and their logos are trademarks or registered trademarks of Logitech Europe S.A. and/or its affiliates in the United States and/or other countries.
