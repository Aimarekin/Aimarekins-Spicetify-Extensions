# Skip After Timestamp

Automatically skip tracks after they reach a timestamp.

![Showcase](https://github.com/Aimarekin/Aimarekins-Spicetify-Extensions/blob/main/skip-after-timestamp/assets/example.gif?raw=true)

Right click anywhere on the playbar to schedule a skip. Tracks will, from then on, skip whenever they reach the skip marker.

Click on the marker to disable auto skip. Right click on it to disable it only for the current playback. You can also drag the marker around, both with left and right click. To set a precise skip time, hover over the marker, and click on the shown duration to manually input one.

Though by default the skip will be done based on an absolute timestamp, you can also configure it to skip after a percentage of the song is completed instead. Toggle this in your Spotify settings.

## Installation
With Spicetify Marketplace, install the "Skip After Timestamp" extension. Or manually, by placing the file [_dist/skip-after-timestamp.js](https://github.com/Aimarekin/Aimarekins-Spicetify-Extensions/blob/main/_dist/skip-after-timestamp.js) in your Extensions folder, adding the extension to your config, and applying. [See how to install extensions manually](https://spicetify.app/docs/advanced-usage/extensions).

## Theming
If you are a theme developer, or would like to modify the aspect of this extension, you can modify the CSS rules applied by this extension. Head to [src/style.scss](https://github.com/Aimarekin/Aimarekins-Spicetify-Extensions/blob/main/skip-after-timestamp/src/style.scss) to see the applied SCSS.

This file is not plain CSS - it is SCSS, an extension of CSS that allows for an expanded syntax. It is compiled to CSS when the extension is compiled. To see the plain CSS, you can compile the SCSS with an [online tool](https://www.sassmeister.com), or inspect it from within Spicetify. Run `spicetify enable-dev-tools` to open Spicetify with devtools enabled (`CTRL+SHIFT+I`).

## Translating
This extension is localized. You can translate the extension into your language by creating a copy of the file [src/loc/en.json](https://github.com/Aimarekin/Aimarekins-Spicetify-Extensions/blob/main/skip-after-timestamp/src/loc/en.json) and translating its contents. [src/localizer.tsx](https://github.com/Aimarekin/Aimarekins-Spicetify-Extensions/blob/main/skip-after-timestamp/src/localizer.tsx) also has to be modified to import and support the new language.

## Building
This extension has been made with [Spicetify Creator](https://spicetify.app/docs/development/spicetify-creator/). Run `npm run build-local` to compile it into Javascript.

---

[Source code available on GitHub](https://github.com/Aimarekin/Aimarekins-Spicetify-Extensions/tree/main/skip-after-timestamp)

[![Github Stars badge](https://img.shields.io/github/stars/Aimarekin/Aimarekins-Spicetify-Extensions?logo=github&style=social)](https://github.com/Aimarekin/Aimarekins-Spicetify-Extensions)