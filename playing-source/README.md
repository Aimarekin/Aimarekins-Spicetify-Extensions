# Playing Source
 
See the context of where you're playing from, and jump to it.

On mobile devices, there is an indicator on top of the currently playing screen telling you where Spotify is playing audio from. For example, from a playlist, from your queue, or from an artist's top songs.

This extension seeks to implement this feature on desktop: hover your mouse over the cover art of the currently playing track to see a popup with information of the playing context.

The context is displayed as an overlay on the expanded album cover on your left and right sidebars (the right sidebar is an experimental setting you can toggle), and as a tooltip on the minified cover. Hover your mouse over the art to display the overlay/tooltip.

![Showcase](https://github.com/Aimarekin/Aimarekins-Spicetify-Extensions/blob/main/playing-source/assets/example.gif?raw=true)

![Screenshot Gallery](https://github.com/Aimarekin/Aimarekins-Spicetify-Extensions/blob/main/playing-source/assets/gallery.png?raw=true)

## Installation
With Spicetify Marketplace, install the "Playing Source" extension. Or manually, by placing the file [dist/playing-source.js](https://github.com/Aimarekin/Aimarekins-Spicetify-Extensions/blob/main/dist/playing-source.js) in your Extensions folder, adding the extension to your config, and applying. [See how to install extensions manually](https://spicetify.app/docs/advanced-usage/extensions).

## Theming
If you are a theme developer, or would like to modify the aspect of this extension, you can modify the CSS rules applied by this extension. Head to [src/style.scss](https://github.com/Aimarekin/Aimarekins-Spicetify-Extensions/blob/main/playing-source/src/style.scss) to see the applied SCSS.

This file is not plain CSS - it is SCSS, an extension of CSS that allows for an expanded syntax. It is compiled to CSS when the extension is compiled. To see the plain CSS, you can compile the SCSS with an [online tool](https://www.sassmeister.com), or inspect it from within Spicetify. Run `spicetify enable-dev-tools` to open Spicetify with devtools enabled (`CTRL+SHIFT+I`).

## Translating
This extension is localized. You can translate the extension into your language by creating a copy of the file [src/loc/en.json](https://github.com/Aimarekin/Aimarekins-Spicetify-Extensions/blob/main/playing-source/src/loc/en.json) and translating its contents. [src/localizer.tsx](https://github.com/Aimarekin/Aimarekins-Spicetify-Extensions/blob/main/playing-source/src/localizer.tsx) also has to be modified to import and support the new language.

## Building
This extension has been made with (Spicetify Creator)[https://spicetify.app/docs/development/spicetify-creator/]. Run `npm run build-local` to compile it into Javascript.

---

[Source code available on GitHub](https://github.com/Aimarekin/Aimarekins-Spicetify-Extensions/tree/main/playing-source)

[![Github Stars badge](https://img.shields.io/github/stars/Aimarekin/Aimarekins-Spicetify-Extensions?logo=github&style=social)](https://github.com/Aimarekin/Aimarekins-Spicetify-Extensions)