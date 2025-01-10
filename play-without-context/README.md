# Play without Context
 
When you play something from a source (like a playlist, album, or artist), Spotify gives you a playing context, so next items played will be sourced from that context.

You can play only a item without its context by, for example, searching it and playing from search. This extension allows you to quickly play something without a context by simply right clicking it and selecting "Play without context".

![Showcase](https://github.com/Aimarekin/Aimarekins-Spicetify-Extensions/blob/main/play-without-context/assets/example.png?raw=true)

You can also select multiple items and select the option. This will play the first item without context, and prepend the rest to the queue.

## Installation
With Spicetify Marketplace, install the "Play without Context" extension. Or manually, by placing the file [_dist/play-without-context.js](https://github.com/Aimarekin/Aimarekins-Spicetify-Extensions/blob/main/_dist/play-without-context.js) in your Extensions folder, adding the extension to your config, and applying. [See how to install extensions manually](https://spicetify.app/docs/advanced-usage/extensions).

## Translating
This extension is localized. You can add a message saying "Play without context" in your language in the file [src/localization/loc.json](https://github.com/Aimarekin/Aimarekins-Spicetify-Extensions/blob/main/play-without-context/src/localization/loc.json)

## Building
This extension is built with [ESBuild](https://esbuild.github.io/). Run `npm run build:local` to compile it into Javascript.

---

[Source code available on GitHub](https://github.com/Aimarekin/Aimarekins-Spicetify-Extensions/tree/main/play-without-context)

[![Github Stars badge](https://img.shields.io/github/stars/Aimarekin/Aimarekins-Spicetify-Extensions?logo=github&style=social)](https://github.com/Aimarekin/Aimarekins-Spicetify-Extensions)