# Section Marker
 
See a song's highlighted sections straight from your playbar.

This extension adds markers and a highlighted background to the different sections of a song so you can quickly identify the rhythm and mood changes, drops, and other section distinctions for a song.

The sections are fetched through Spotify's [Audio Analysis Web API](https://developer.spotify.com/documentation/web-api/reference/get-audio-analysis).

![Showcase](https://github.com/Aimarekin/Aimarekins-Spicetify-Extensions/blob/main/section-marker/assets/samples_reduced.gif?raw=true)

This extension has been tested with all major functional themes. Below are some examples:

![Default Example](https://github.com/Aimarekin/Aimarekins-Spicetify-Extensions/blob/main/section-marker/assets/example_default.png?raw=true)
![Sleek Example](https://github.com/Aimarekin/Aimarekins-Spicetify-Extensions/blob/main/section-marker/assets/example_sleek.png?raw=true)
![Blossom Example](https://github.com/Aimarekin/Aimarekins-Spicetify-Extensions/blob/main/section-marker/assets/example_blossom.png?raw=true)
![Catpuccin Example](https://github.com/Aimarekin/Aimarekins-Spicetify-Extensions/blob/main/section-marker/assets/example_catpuccin.png?raw=true)
![Ziro Example](https://github.com/Aimarekin/Aimarekins-Spicetify-Extensions/blob/main/section-marker/assets/example_ziro.png?raw=true)
![Comfy Example](https://github.com/Aimarekin/Aimarekins-Spicetify-Extensions/blob/main/section-marker/assets/example_comfy.png?raw=true)
![Bloom Example](https://github.com/Aimarekin/Aimarekins-Spicetify-Extensions/blob/main/section-marker/assets/example_bloom.png?raw=true)
![Galaxy Example](https://github.com/Aimarekin/Aimarekins-Spicetify-Extensions/blob/main/section-marker/assets/example_galaxy.png?raw=true)
![Nord Example](https://github.com/Aimarekin/Aimarekins-Spicetify-Extensions/blob/main/section-marker/assets/example_nord.png?raw=true)
![Retroblur Example](https://github.com/Aimarekin/Aimarekins-Spicetify-Extensions/blob/main/section-marker/assets/example_retroblur.png?raw=true)

Yes, even sidebar controls:

![Sidebar controls Example](https://github.com/Aimarekin/Aimarekins-Spicetify-Extensions/blob/main/section-marker/assets/example_sidebar_controls.png?raw=true)

The markers will be automatically hidden
if the playbar is too thin, which would make them look too cramped.

**Notice**: Nord is not yet fully compatible and you may notice a small offset - a fix has been proposed to Nord's developers.

Sections are not available on local files due to Spotify limitations. Podcasts do not have sections.

## Installation
With Spicetify Marketplace, install the "Section Marker" extension. Or manually, by placing the file [_dist/section-marker.js](https://github.com/Aimarekin/Aimarekins-Spicetify-Extensions/blob/main/_dist/section-marker.js) in your Extensions folder, adding the extension to your config, and applying. [See how to install extensions manually](https://spicetify.app/docs/advanced-usage/extensions).

## Theming
If you are a theme developer, or would like to modify the aspect of this extension, you can modify the CSS rules applied by this extension. Head to [src/style.scss](https://github.com/Aimarekin/Aimarekins-Spicetify-Extensions/blob/main/section-marker/src/style.scss) to see the applied SCSS.

This file is not plain CSS - it is SCSS, an extension of CSS that allows for an expanded syntax. It is compiled to CSS when the extension is compiled. To see the plain CSS, you can compile the SCSS with an [online tool](https://www.sassmeister.com), or inspect it from within Spicetify. Run `spicetify enable-dev-tools` to open Spicetify with devtools enabled (`CTRL+SHIFT+I`).

In order to fetch the progress bar's dimensions and radius, this extension uses the `--progress-bar-height` and `--progress-bar-radius` variables from the `.progress-bar` class. Please make sure your theme/snippet uses these variables adequately for this extension to be fully compatible.

## Building
This extension has been made with [Spicetify Creator](https://spicetify.app/docs/development/spicetify-creator/). Run `npm run build-local` to compile it into Javascript.

---

[Source code available on GitHub](https://github.com/Aimarekin/Aimarekins-Spicetify-Extensions/tree/main/section-marker)

[![Github Stars badge](https://img.shields.io/github/stars/Aimarekin/Aimarekins-Spicetify-Extensions?logo=github&style=social)](https://github.com/Aimarekin/Aimarekins-Spicetify-Extensions)