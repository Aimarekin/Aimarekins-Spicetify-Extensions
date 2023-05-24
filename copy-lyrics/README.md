# Copy Lyrics
 
Copy the lyrics of your song directly from the "Show Lyrics" view. Click and drag your mouse accross the lyrics, then release to copy them into your clipboard.

Press `CTRL+A` to copy the whole song at once.

The [Lyrics Plus Custom App](https://spicetify.app/docs/advanced-usage/custom-apps/#lyrics-plus) has other and similar features you might be interested in.

![Demo](https://github.com/Aimarekin/Aimarekins-Spicetify-Extensions/blob/main/copy-lyrics/assets/demo.gif?raw=true)

## Installation
With Spicetify Marketplace, install the "Copy Lyrics" extension. Or manually, by placing the file [dist/copy-lyrics.js](https://github.com/Aimarekin/Aimarekins-Spicetify-Extensions/blob/main/dist/copy-lyrics.js) in your Extensions folder, adding the extension to your config, and applying. [See how to install extensions manually](https://spicetify.app/docs/advanced-usage/extensions).

## Theming
If you are a theme developer, or would like to modify the aspect of this extension, you can modify the CSS rules applied by this extension. Head to [src/style.css](https://github.com/Aimarekin/Aimarekins-Spicetify-Extensions/blob/main/copy-lyrics/src/style.css) to see the applied CSS.

Unfortunately, due to what's most likely errors with variable inheritance on the ::highlight() pseudo-element, the deselection animation after lyrics are copied can not be modified.

## Translating
This extension is localized. You can add a message saying "Copied to clipboard!" in your language in the file [src/loc.json](https://github.com/Aimarekin/Aimarekins-Spicetify-Extensions/blob/main/copy-lyrics/src/loc.json)

## Building
This extension has been made with (Spicetify Creator)[https://spicetify.app/docs/development/spicetify-creator/]. Run `npm run build-local` to compile it into Javascript.

---

[Source code available on GitHub](https://github.com/Aimarekin/Aimarekins-Spicetify-Extensions/tree/main/copy-lyrics)

[![Github Stars badge](https://img.shields.io/github/stars/Aimarekin/Aimarekins-Spicetify-Extensions?logo=github&style=social)](https://github.com/Aimarekin/Aimarekins-Spicetify-Extensions)