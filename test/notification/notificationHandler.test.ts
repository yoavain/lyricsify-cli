import { notifyBatchResult, notifyResult } from "~src/notification/notificationHandler";
import { MockNotifier } from "~test/__mocks__";
import type { ContextState } from "~src/state/context";
import { NotificationText, NotificationType } from "~src/notification/notifierTypes";
import type { BatchContextState } from "~src/state/batchContext";

const mockNotifier = new MockNotifier();
jest.mock("~src/notification/notifier", () => ({
    Notifier: function() {
        return mockNotifier;
    }
}));

describe("Test notificationHandler", () => {
    describe("Test notifyResult", () => {
        it("Should notify dry run", async () => {
            notifyResult(mockNotifier, { dryRun: true } as ContextState);

            expect(mockNotifier.notif).toHaveBeenCalledWith(NotificationText.DRY_RUN, NotificationType.WARNING);
        });

        it("Should notify lyrics not found", async () => {
            notifyResult(mockNotifier, { dryRun: false, lyricsFetched: false } as ContextState);

            expect(mockNotifier.notif).toHaveBeenCalledWith(NotificationText.LYRICS_NOT_FOUND, NotificationType.WARNING);
        });

        it("Should notify lyrics written to header and .txt file", async () => {
            notifyResult(mockNotifier, { lyricsFetched: true, lyricsWrittenToTxt: true, lyricsWrittenToHeader: true } as ContextState);

            expect(mockNotifier.notif).toHaveBeenCalledWith(NotificationText.LYRICS_WRITTEN_TO_HEADER_AND_TXT, NotificationType.DOWNLOAD);
        });

        it("Should notify lyrics written to header", async () => {
            notifyResult(mockNotifier, { lyricsFetched: true, lyricsWrittenToHeader: true } as ContextState);

            expect(mockNotifier.notif).toHaveBeenCalledWith(NotificationText.LYRICS_WRITTEN_TO_HEADER, NotificationType.DOWNLOAD);
        });

        it("Should notify lyrics written to .txt file", async () => {
            notifyResult(mockNotifier, { lyricsFetched: true, lyricsWrittenToTxt: true } as ContextState);

            expect(mockNotifier.notif).toHaveBeenCalledWith(NotificationText.LYRICS_WRITTEN_TO_TXT, NotificationType.DOWNLOAD);
        });

        it("Should notify lyrics already exists", async () => {
            notifyResult(mockNotifier, { lyricsFetched: true, shouldSaveHeader: true, lyricsFoundInHeader: true } as ContextState);

            expect(mockNotifier.notif).toHaveBeenCalledWith(NotificationText.LYRICS_ALREADY_EXIST, NotificationType.WARNING);
        });

        it("Should notify lyrics not written to .txt file", async () => {
            notifyResult(mockNotifier, { lyricsFetched: true, shouldSaveTxt: true } as ContextState);

            expect(mockNotifier.notif).toHaveBeenCalledWith(NotificationText.LYRICS_NOT_WRITTEN_TO_TXT, NotificationType.WARNING);
        });

        it("Should notify lyrics not written to header or .txt file", async () => {
            notifyResult(mockNotifier, { lyricsFetched: true, shouldSaveHeader: true } as ContextState);

            expect(mockNotifier.notif).toHaveBeenCalledWith(NotificationText.LYRICS_NOT_WRITTEN_TO_HEADER_OR_TXT, NotificationType.WARNING);
        });
    });
    describe("Test notifyBatchResult", () => {
        it("Should notify no file handled", () => {
            notifyBatchResult(mockNotifier, { filesHandled: 0 } as BatchContextState);

            expect(mockNotifier.notif).toHaveBeenCalledWith(NotificationText.NO_FILE_HANDLED, NotificationType.WARNING);
        });

        it("Should notify lyrics not found", () => {
            notifyBatchResult(mockNotifier, { dryRun: false, filesHandled: 1, lyricsFetched: 0 } as BatchContextState);

            expect(mockNotifier.notif).toHaveBeenCalledWith(NotificationText.LYRICS_NOT_FOUND, NotificationType.WARNING);
        });

        it("Should notify dry run", () => {
            notifyBatchResult(mockNotifier, { dryRun: true, filesHandled: 1 } as BatchContextState);

            expect(mockNotifier.notif).toHaveBeenCalledWith(NotificationText.DRY_RUN, NotificationType.WARNING);
        });

        it("Should notify partially handled", () => {
            notifyBatchResult(mockNotifier, { dryRun: false, filesHandled: 1, lyricsFetched: 1, partial: true } as BatchContextState);

            expect(mockNotifier.notif).toHaveBeenCalledWith(NotificationText.LYRICS_SOME_PARTIAL, NotificationType.WARNING);
        });

        it("Should notify fully handled", () => {
            notifyBatchResult(mockNotifier, { dryRun: false, filesHandled: 1, lyricsFetched: 1, partial: false } as BatchContextState);

            expect(mockNotifier.notif).toHaveBeenCalledWith(NotificationText.LYRICS_ALL_FOUND, NotificationType.DOWNLOAD);
        });
    });
});