import * as esbuild from "esbuild"
import { exec } from "child_process"
import * as path from "path"
import commandLineArgs from "command-line-args"
import { glob } from "glob"
import pkg from "./package.json" assert { type: "json" }

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

const buildOptions = {
    entryPoints: entry,
    bundle: true,
    minify: options.prod,
    treeShaking: options.prod,
    target: "chrome106", // This is the chrome version of oldest supported version of Spotify (1.2.0)
    jsx: "transform",
    outfile: path.join(options.dist ? DIST_PATH : await getSpicetifyExtensionsPath(), pkg.name + ".js"),
    logLevel: options.verbose ? "verbose": "info",
    loader: {
        ".ogg": "dataurl",
        ".png": "dataurl"
    },
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