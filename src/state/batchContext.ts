import type { ContextState } from "~src/state/context";
import type { Config } from "~src/config/commonConfig";

export type BatchContextState = {
    dryRun: boolean
    filesHandled: number
    savedToCache: number
    lyricsFoundInHeader: number
    lyricsTxtAlreadyExist: number
    lyricsFetched: number
    lyricsWrittenToTxt: number
    lyricsWrittenToHeader: number
    partial: boolean
}

export class BatchContext {
    readonly #batchContextState: BatchContextState;

    constructor({ dryRun }: Omit<Config, "filename">) {
        this.#batchContextState = {
            dryRun,
            filesHandled: 0,
            savedToCache: 0,
            lyricsFoundInHeader: 0,
            lyricsTxtAlreadyExist: 0,
            lyricsFetched: 0,
            lyricsWrittenToTxt: 0,
            lyricsWrittenToHeader: 0,
            partial: false
        };
    }

    addResult({ savedToCache, lyricsFoundInHeader, lyricsFetched, lyricsWrittenToTxt, lyricsTxtAlreadyExist, shouldSaveTxt, lyricsWrittenToHeader, shouldSaveHeader }: ContextState) {
        this.#batchContextState.filesHandled++;

        if (savedToCache) {
            this.#batchContextState.savedToCache++;
        }

        if (lyricsFoundInHeader) {
            this.#batchContextState.lyricsFoundInHeader++;
        }

        if (lyricsFetched) {
            this.#batchContextState.lyricsFetched++;
        }

        if (lyricsWrittenToTxt) {
            this.#batchContextState.lyricsWrittenToTxt++;
        }
        else if (shouldSaveTxt && !lyricsTxtAlreadyExist) {
            this.#batchContextState.partial = true;
        }

        if (lyricsWrittenToHeader) {
            this.#batchContextState.lyricsWrittenToHeader++;
        }
        else if (shouldSaveHeader && !lyricsFoundInHeader) {
            this.#batchContextState.partial = true;
        }
    }

    public get(): BatchContextState {
        return Object.freeze(this.#batchContextState);
    }
}
