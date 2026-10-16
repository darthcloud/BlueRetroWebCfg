# BlueRetro Web Config

A reworked browser frontend for configuring a [BlueRetro](https://github.com/darthcloud/BlueRetro) adapter over Web Bluetooth.

This project is based on the original [darthcloud/BlueRetroWebCfg](https://github.com/darthcloud/BlueRetroWebCfg) repository. It keeps the existing BlueRetro commands and configuration formats while reorganizing the frontend around a single connection and a clearer, responsive interface. The Web Bluetooth implementation was originally based on [Google Chrome Samples](https://github.com/GoogleChrome/samples).

## What it does

- Keeps one adapter connection active while moving between configuration tools.
- Applies controller presets or configures profiles, ports, accessories, button mappings, deadzones, and turbo individually.
- Installs firmware over Bluetooth and reconnects once to verify an update.
- Manages system settings, N64 Controller Pak data, Dreamcast VMU data, and adapter files.
- Provides connection and tool activity logs without filling the main interface with debugging details.
- Shows configuration pages before connecting, with unavailable controls clearly disabled.
- Preserves direct links to the original tool pages by routing them through the new frontend.

> **Reconnection limitation:** Automatic reconnection only works if the Bluetooth connection drops while the page remains open. Refreshing or closing the page requires connecting to the adapter again because the browser does not preserve the active Web Bluetooth connection.

## Screenshots

### Dashboard

![BlueRetro Web Config dashboard](docs/screenshots/dashboard.png)

### Controller setup

![BlueRetro controller setup](docs/screenshots/controller-setup.png)

## Browser requirements

Use a Chromium-based browser with Web Bluetooth support, such as Google Chrome or Microsoft Edge. A deployed copy must use HTTPS; `http://localhost` is supported for local development.

More information about BlueRetro is available on the [project page](https://hackaday.io/project/170365-blueretro) and in the [firmware repository](https://github.com/darthcloud/BlueRetro).

## Documentation

- [Start here](docs/README.md) — connect the adapter and choose the right tool.
- [Pair a controller](docs/pairing.md) — common pairing steps, controller-specific instructions, and the compatibility table.
- [Configure controllers and accessories](docs/configuration.md) — presets, ports, mappings, rumble, and save memory.
- [Update firmware and recover](docs/firmware.md) — Bluetooth updates, verification, logs, and factory recovery.
- [Technical reference](docs/technical-reference.md) — profiles, mapping fields, turbo, adapter buttons, and LEDs.

These guides focus on Web Config. Refer to the [original BlueRetro wiki](https://github.com/darthcloud/BlueRetro/wiki) when a topic is not covered here.

## Run locally with Docker

From this repository, run:

```sh
docker compose up --build
```

Open <http://localhost:4000>. Changes to the site files reload automatically.

Stop the server with `Ctrl+C`, then run `docker compose down` if you want to remove the container.

## Project layout

```
index.html            Main page (app shell); tools load inside it
pages/                Tool pages, still served at their original URLs (e.g. /advance.html)
js/app.js             App shell: navigation and the shared Bluetooth connection
js/tools/             Script for each tool page
js/utils/             Shared BlueRetro Bluetooth commands and constants
assets/css/           Stylesheet
assets/images/        Icon and banner
assets/data/          Game ID database used for game names
assets/lib/sql.js/    Third-party SQLite library (reads the game ID database)
map/                  Preset files (path is read from the GitHub API, keep it here)
tests/                Browser tests with a simulated adapter (see below)
service-worker.js     Offline cache (must stay at the root)
_layouts/, _includes/ Jekyll templates
```

## Run the tests

The browser tests run the real pages in Chromium against a simulated BlueRetro adapter (`tests/fixtures/fake-blueretro.js`), so no adapter or Bluetooth hardware is needed. With Docker:

```sh
docker compose run --rm tests
```

This starts the site if needed, then runs everything in `tests/specs/`. A failure report with screenshots and traces is written to `tests/playwright-report/`. To run one file: `docker compose run --rm tests sh -c "npx playwright test specs/ota.spec.js"`.

If Node.js is installed locally and the site is running on port 4000, you can also run `npm install` and `npx playwright install chromium` once in `tests/`, then `npm test`.
