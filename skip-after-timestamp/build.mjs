import * as esbuild from "esbuild"
import commandLineArgs from "command-line-args"
import { glob } from "glob"
import { exec } from "child_process"
import * as path from "path"
import pkg from "./package.json" assert { type: "json" }
import * as fs from "fs/promises"
import YAML from "yaml"

import { sassPlugin } from 'esbuild-sass-plugin'
import postcss from "postcss"
import cssnano from 'cssnano';

const DIST_PATH = path.resolve("../_dist")

function getSpicetifyExtensionsPath() {
    return new Promise((resolve, reject) => {
        exec("spicetify path userdata", (err, stdout, stderr) => {
            if (err) reject(err)
            else if (stderr) reject(stderr)
            else resolve(path.join(stdout.trim(), "Extensions"))
        })
    })
}

const options = commandLineArgs([
    { name: "watch", alias: "w", type: Boolean, defaultValue: false },
    { name: "prod", type: Boolean, defaultValue: false },
    { name: "dist", type: Boolean, defaultValue: false },
    { name: "verbose", type: Boolean, defaultValue: false }
])

if (!options.prod && options.dist) {
    console.warn("You've exported non-prod to dist! This is probably not what you want.")
}

const entry = await glob("src/app.{js,jsx,ts,tsx}")

if (!entry.length) {
    console.error("No entry points found!")
    process.exit(1)
}
else if (entry.length > 1) {
    console.error("Multiple entry points found! " + entry.join(", "))
    process.exit(1)
}

let loadLocalizationsPlugin = {
    name: "load-localizations",
    setup(build) {
        // Intercept the "translations" import path
        build.onResolve({ filter: /^translations$/ }, args => ({
            path: args.path,
            namespace: "localizations",
            sideEffects: false,
        })),

        // Load and process file contents
        build.onLoad({ filter: /.*/, namespace: "localizations" }, async (args) => {
            const loc_files = await glob("localization/*{.json,.yml,.yaml}")
            const loc = {}

            for (const file of loc_files) {
                const data = await fs.readFile(file)
                const ext = path.extname(file)
                const lang = path.basename(file, ext)

                if (ext === ".json") {
                    loc[lang] = JSON.parse(data)
                } else if (ext === ".yml" || ext === ".yaml") {
                    loc[lang] = YAML.parse(data)
                }
            }

            return {
                contents: JSON.stringify(loc),
                loader: "json",
                watchDirs: [ "localization" ],
            }
        })
    }
}

const buildOptions = {
    entryPoints: entry,
    bundle: true,
    minify: options.prod,
    treeShaking: options.prod,
    target: "chrome106", // This is the chrome version of oldest supported version of Spotify (1.2.0)
    jsx: "transform",
    outfile: path.join(options.dist ? DIST_PATH : await getSpicetifyExtensionsPath(), pkg.name + ".js"),
    logLevel: options.verbose ? "verbose": "info",
    plugins: [
        sassPlugin({
            type: "style",
            ... (options.prod ? {
            transform: async (source, resolveDir) => {
                const result = await postcss([cssnano()]).process(source, { from: undefined })
                return result.css
            } } : {})
        }),
        loadLocalizationsPlugin,
    ],
    define: {
        DEV: (!options.prod).toString(),
        VER: `"${pkg.version}"`
    },
    metafile: !options.watch,
}

try {
    if (options.watch) {
        const ctx = await esbuild.context(buildOptions)
        await ctx.watch()
    } else {
        const res = await esbuild.build(buildOptions)
        console.log(await esbuild.analyzeMetafile(res.metafile, {
            verbose: options.verbose,
        }))
    }
} catch (e) {
    console.error("Build failed: " + e)
    process.exit(1)
}