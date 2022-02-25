import type { Config } from "~src/config/commonConfig";

export type ContextState = {
    shouldSaveHeader: boolean
    shouldSaveTxt: boolean
    dryRun: boolean

    savedToCache: boolean
    lyricsFoundInHeader: boolean
    lyricsTxtAlreadyExist: boolean
    lyricsFetched: boolean
    lyricsWrittenToTxt: boolean
    lyricsWrittenToHeader: boolean
}

export class Context {
    readonly #contextState: ContextState;

    constructor({ saveHeader, saveTxt, dryRun }: Omit<Config, "filename">) {
        this.#contextState = {
            shouldSaveHeader: saveHeader,
            shouldSaveTxt: saveTxt,
            dryRun: dryRun,
            savedToCache: false,
            lyricsFoundInHeader: false,
            lyricsTxtAlreadyExist: false,
            lyricsFetched: false,
            lyricsWrittenToTxt: false,
            lyricsWrittenToHeader: false
        };
    }

    setSavedToCache() {
        this.#contextState.savedToCache = true;
    }
    setLyricsFoundInHeader() {
        this.#contextState.lyricsFoundInHeader = true;
    }
    setLyricsTxtAlreadyExist() {
        this.#contextState.lyricsTxtAlreadyExist = true;
    }
    setLyricsFetched() {
        this.#contextState.lyricsFetched = true;
    }
    setLyricsWrittenToTxt() {
        this.#contextState.lyricsWrittenToTxt = true;
    }
    setLyricsWrittenToHeader() {
        this.#contextState.lyricsWrittenToHeader = true;
    }

    public get(): ContextState {
        return Object.freeze(this.#contextState);
    }
}

