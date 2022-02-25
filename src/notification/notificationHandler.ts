import type { NotifierInterface } from "~src/notification/notifier";
import { NotificationText, NotificationType } from "~src/notification/notifierTypes";
import type { BatchContextState } from "~src/state/batchContext";
import type { ContextState } from "~src/state/context";

export const notifyResult = (notifier: NotifierInterface, { shouldSaveHeader, shouldSaveTxt, lyricsFoundInHeader, lyricsFetched, dryRun, lyricsWrittenToTxt, lyricsWrittenToHeader }: ContextState) => {
    if (dryRun) {
        notifier?.notif(NotificationText.DRY_RUN, NotificationType.WARNING);
        return;
    }
    if (!lyricsFetched) {
        notifier?.notif(NotificationText.LYRICS_NOT_FOUND, NotificationType.WARNING);
        return;
    }

    if (lyricsWrittenToTxt && lyricsWrittenToHeader) {
        notifier?.notif(NotificationText.LYRICS_WRITTEN_TO_HEADER_AND_TXT, NotificationType.DOWNLOAD);
    }
    else if (lyricsWrittenToHeader) {
        notifier?.notif(NotificationText.LYRICS_WRITTEN_TO_HEADER, NotificationType.DOWNLOAD);
    }
    else if (lyricsWrittenToTxt) {
        notifier?.notif(NotificationText.LYRICS_WRITTEN_TO_TXT, NotificationType.DOWNLOAD);
    }
    else if (shouldSaveHeader && lyricsFoundInHeader) {
        notifier?.notif(NotificationText.LYRICS_ALREADY_EXIST, NotificationType.WARNING);
    }
    else if (shouldSaveTxt) {
        notifier?.notif(NotificationText.LYRICS_NOT_WRITTEN_TO_TXT, NotificationType.WARNING);
    }
    else {
        notifier?.notif(NotificationText.LYRICS_NOT_WRITTEN_TO_HEADER_OR_TXT, NotificationType.WARNING);
    }
};

export const notifyBatchResult = (notifier: NotifierInterface, { dryRun, filesHandled, lyricsFetched, partial }: BatchContextState) => {
    if (filesHandled === 0) {
        notifier?.notif(NotificationText.NO_FILE_HANDLED, NotificationType.WARNING);
        return;
    }
    if (!dryRun && filesHandled && !lyricsFetched) {
        notifier?.notif(NotificationText.LYRICS_NOT_FOUND, NotificationType.WARNING);
        return;
    }
    if (dryRun && filesHandled) {
        notifier?.notif(NotificationText.DRY_RUN, NotificationType.WARNING);
        return;
    }

    if (partial) {
        notifier?.notif(NotificationText.LYRICS_SOME_PARTIAL, NotificationType.WARNING);
    }
    else {
        notifier?.notif(NotificationText.LYRICS_ALL_FOUND, NotificationType.DOWNLOAD);
    }
};
