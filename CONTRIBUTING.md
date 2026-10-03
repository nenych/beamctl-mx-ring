# Contributing to beamctl-mx-ring

Bug reports, fixes and new actions are welcome. For anything larger than a small fix, please open an issue first so we can agree on the approach.

The plugin is deliberately a thin wrapper: it maps Actions Ring actions to `beamctl` commands. Anything about talking to the light belongs in [beamctl](https://github.com/nenych/beamctl), not here.

## Development

Requires macOS, Node.js 22 or newer, Logi Options+ and `beamctl` installed (see the README).

```
npm install
npm run build     # type-check and bundle into dist/
npm run link      # symlink dist/ into the Logi Plugin Service and reload the plugin
```

Run `npm run build && npm run link` after each change. Logs: `~/Library/Application Support/Logi/LogiPluginService/Logs/plugin_logs/Beamctl.log`.

There are no automated tests; describe in the pull request how you checked the change in the Actions Ring.

## Layout

| Path | Contents |
|---|---|
| `index.ts` | registers the actions |
| `src/actions.ts` | command and adjustment classes, lookup of the `beamctl` binary |
| `package/actionicons/`, `package/actionsymbols/` | one SVG per action, named after the action; the two folders hold identical files |
| `package/metadata/` | plugin manifest and icon |
| `assets.yml` | files copied into the package (licences) |
| `docs/` | README images: each action icon placed on a dark circle; update the matching file when an icon changes |

## Guidelines

- Keep pull requests small and focused on one change.
- Icons must be your own work, or under the MIT or Apache 2.0 licence with the notice added to `THIRD_PARTY_NOTICES.md` (a Logi Marketplace requirement).
- A new runtime dependency ends up bundled in the package: add its licence to `THIRD_PARTY_NOTICES.md`.
- Names must not contain Logitech trademarks; refer to the products descriptively.

## Conduct and licence

Be respectful and constructive. By contributing you agree that your contribution is licensed under the MIT License of this project.
