// Intercept calls to the playback API to transfer it's changes to the preview

export interface PlaybackState {
    volume: number,
    repeat: number,
}

// No clue why it's this value but that's what .increaseVolume() does
const VOLUME_CHANGE_DIFFERENCE = 0.06250095368886854

// Inject proxies
function proxifyPlayback(from: any, target: string, handler: Function) {
    const originalFunc = from[target];
    from[target] = new Proxy(originalFunc, {
        apply: function (target, thisArg, argumentsList) {
            if (isEngaged()) return handler.apply(thisArg, argumentsList);
            return target.apply(thisArg, argumentsList);
        },
    });
}

new Promise(async resolve => {
    while (!Spicetify?.Platform?.PlaybackAPI) {
		await new Promise(resolve => setTimeout(resolve, 0))
	}

    proxifyPlayback(Spicetify.Player, "getVolume", async (): Promise<number> => getPlaybackState().volume)
    proxifyPlayback(Spicetify.Player, "setVolume", async (volume: number): Promise<void> => {

    })
    proxifyPlayback(Spicetify.Player, "raiseVolume", async (): Promise<void> => {

    })
    proxifyPlayback(Spicetify.Player, "lowerVolume", async (): Promise<void> => {

    })

    proxifyPlayback(Spicetify.Player, "getRepeat", async (): Promise<number> => getPlaybackState().repeat)
})

let _engaged = false

let _playbackState: PlaybackState

export const isEngaged = () => _engaged

export const getPlaybackState = (): Readonly<PlaybackState> => _playbackState

export function engage(): Readonly<PlaybackState> {
    if (isEngaged()) return getPlaybackState()

    // Store current playback state
    _playbackState = {
        volume: Spicetify.Player.getVolume(),
        repeat: Spicetify.Player.getRepeat()
    }

    // Begin intercepting playback state changes
    _engaged = true

    // Apply new playback state
    Spicetify.Player.setVolume(0)
    Spicetify.Player.setRepeat(0)



    return getPlaybackState()
}

export function disengage() {
    if (!isEngaged()) return

    // Apply new playback state


    _engaged = false
}