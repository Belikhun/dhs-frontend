<p align="center"><img src="https://raw.githubusercontent.com/Belikhun/dhs-frontend/master/assets/img/icon%40128x128.png" width="96" height="96" alt="Deal Hunter Suite logo"></p>

# dhs-frontend

The Chrome extension of **Deal Hunter Suite**, a tool for flash sale hunters on Vietnamese marketplaces: pick a script for the page you are on, set a target price, and it orders the moment the price drops.

## What is here

- `mainPage/`: the extension's window (420 × 720). `core.js` signs in with the machine's licence,
  lists the scripts the licence allows, and runs one: its settings form, its log viewer and the
  run panel with the countdown.
- `content.js`: the content script that talks to the page being watched.
- `background.js`: opens the window and rewrites request headers for the scripts.
- `assets/`: my own small UI library (buttons, inputs, switches, sliders, the settings menu, sounds).

Scripts are not part of the extension. They are fetched from
[dhs-backend](https://github.com/Belikhun/dhs-backend) for each run, encrypted with a key derived
from the session, and can send their requests through phones running
[dhs-proxy](https://github.com/Belikhun/dhs-proxy) on the local network.

## Loading it

Open `chrome://extensions`, turn on developer mode and load this folder unpacked. It is a
manifest v2 extension, so current Chrome versions may refuse it, and without a server to sign in
to it stops at the splash screen.

## The suite

| Repository | What it is |
| --- | --- |
| [dhs-frontend](https://github.com/Belikhun/dhs-frontend) | the Chrome extension |
| [dhs-backend](https://github.com/Belikhun/dhs-backend) | the licence and script server, with its web console |
| [dhs-proxy](https://github.com/Belikhun/dhs-proxy) | the proxy server that runs on Android phones |
| [dhs-proxy-build](https://github.com/Belikhun/dhs-proxy-build) | compiled builds of the proxy, which phones update from |
| [dhs-archive](https://github.com/Belikhun/dhs-archive) | every packaged release of the extension from 3.0 |

## Status

Deal Hunter Suite was a commercial product from 2019 to early 2022 and is no longer in service.
Its servers are offline, so nothing here runs out of the box, and the marketplace scripts were
written against sites that have changed since. The code is published as it was, for reference.
It is not affiliated with any of the marketplaces it worked on.

More of my work is on [belikhun.dev](https://belikhun.dev).
