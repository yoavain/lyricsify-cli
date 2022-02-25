export enum NotificationType {
    LOGO = "LOGO",
    DOWNLOAD = "DOWNLOAD",
    WARNING = "WARNING",
    NOT_FOUND = "NOT_FOUND",
    FAILED = "FAILED"
}

export enum NotificationText {
    MISSING_INPUT_FILE = "Missing input file",
    UNSUPPORTED_INPUT_FILE = "Unsupported input file",
    DRY_RUN = "Running in dry-run mode",
    LYRICS_NOT_FOUND = "Lyrics not found",
    LYRICS_WRITTEN_TO_HEADER = "Lyrics written to header",
    LYRICS_WRITTEN_TO_TXT = "Lyrics written to .txt file",
    LYRICS_WRITTEN_TO_HEADER_AND_TXT = "Lyrics written to header and .txt file",
    LYRICS_NOT_WRITTEN_TO_TXT = "Lyrics not written since .txt file already exists",
    LYRICS_NOT_WRITTEN_TO_HEADER_OR_TXT = "Lyrics not written to header or .txt file",
    LYRICS_ALREADY_EXIST = "Lyrics already exist",
    NO_FILE_HANDLED = "No file handled",
    LYRICS_SOME_PARTIAL = "Lyrics found for some of the files",
    LYRICS_ALL_FOUND = "Lyrics found for all files"
}

export const getNotificationIcon = (notificationType: NotificationType): string => {
    switch (notificationType) {
        case NotificationType.LOGO:
            return "logo.png";
        case NotificationType.DOWNLOAD:
            return "download.png";
        case NotificationType.WARNING:
            return "warning.png";
        case NotificationType.NOT_FOUND:
            return "not-found.png";
        case NotificationType.FAILED:
            return "failed.png";
    }
};
