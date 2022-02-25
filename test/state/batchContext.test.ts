import { BatchContext } from "~src/state/batchContext";
import type { Config } from "~src/config/commonConfig";
import type { ContextState } from "~src/state/context";

describe("Test batchContext", () => {
    it("Should handle result correctly", () => {
        const batchContext: BatchContext = new BatchContext({} as Config);
        batchContext.addResult({ savedToCache: true, lyricsFoundInHeader: true, lyricsFetched: true, lyricsWrittenToTxt: true, lyricsWrittenToHeader: true } as ContextState);
        expect(batchContext.get()).toEqual({
            filesHandled: 1,
            lyricsFetched: 1,
            lyricsFoundInHeader: 1,
            lyricsTxtAlreadyExist: 0,
            lyricsWrittenToHeader: 1,
            lyricsWrittenToTxt: 1,
            partial: false,
            savedToCache: 1
        });
    });
    it("Should handle result correctly - partial 1", () => {
        const batchContext: BatchContext = new BatchContext({} as Config);
        batchContext.addResult({ lyricsWrittenToTxt: false, shouldSaveTxt: true,  lyricsTxtAlreadyExist: false } as ContextState);
        expect(batchContext.get()).toEqual({
            filesHandled: 1,
            lyricsFetched: 0,
            lyricsFoundInHeader: 0,
            lyricsTxtAlreadyExist: 0,
            lyricsWrittenToHeader: 0,
            lyricsWrittenToTxt: 0,
            partial: true,
            savedToCache: 0
        });
    });
    it("Should handle result correctly - partial 2", () => {
        const batchContext: BatchContext = new BatchContext({} as Config);
        batchContext.addResult({ lyricsWrittenToHeader: false, shouldSaveHeader: true,  lyricsFoundInHeader: false } as ContextState);
        expect(batchContext.get()).toEqual({
            filesHandled: 1,
            lyricsFetched: 0,
            lyricsFoundInHeader: 0,
            lyricsTxtAlreadyExist: 0,
            lyricsWrittenToHeader: 0,
            lyricsWrittenToTxt: 0,
            partial: true,
            savedToCache: 0
        });
    });
});