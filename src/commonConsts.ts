import { SupportedFileExtension } from "~src/filetypes/types";

export const PROGRAM_TITLE = "Lyricsify Downloader";
export const PROGRAM_NAME = "Lyricsify";
export const PROGRAM_LOG_FILENAME = "lyricsify.log";
export const PROGRAM_DB_FILENAME = "lyricsify.sqlite3";
export const PROGRAM_DOTENV_FILENAME = "lyricsify.env";

export const EXTENSIONS = new Set<SupportedFileExtension>([SupportedFileExtension.MP3, SupportedFileExtension.FLAC]);
