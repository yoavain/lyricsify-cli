import type { LyricsField } from "~src/filetypes/common";
import { SupportedFileExtension } from "~src/filetypes/types";
import type { FileHandler } from "~src/filetypes/fileHandler";
import type { IAudioMetadata } from "music-metadata";
import type NodeID3 from "node-id3";
import { Promise as NodeID3Promise } from "node-id3";
import { backupFile } from "~src/fileUtils";
import { ErrorMessages } from "~src/errors";
import type { Language } from "~src/types";

const getExtension = (): SupportedFileExtension => {
    return SupportedFileExtension.MP3;
};

const verifyType = (audioMetadata: IAudioMetadata): boolean => {
    return audioMetadata?.format?.container === "MPEG";
};

const parseLyrics = (audioMetadata: IAudioMetadata): LyricsField => {
    const lyricsItem = audioMetadata?.native?.["ID3v2.3"]?.find((field) => field.id === "USLT")?.value;

    if (!lyricsItem) {
        return {};
    }

    return {
        lyrics: lyricsItem.text,
        language: lyricsItem.language
    };
};

const writeLyrics = async (filePath: string, language: Language, lyrics: string, skipBackup?: boolean) => {
    const existingTags: NodeID3.Tags = await NodeID3Promise.read(filePath);
    if (!existingTags?.unsynchronisedLyrics?.text) {
        if (!skipBackup) {
            await backupFile(filePath);
        }
        const lyricsTags: NodeID3.Tags = {
            unsynchronisedLyrics: {
                language: language,
                text: lyrics
            }
        };
        await NodeID3Promise.update(lyricsTags, filePath);
    }
    else {
        throw new Error(ErrorMessages.ERROR_FILE_ALREADY_HAS_LYRICS);
    }
};

export const MP3: FileHandler = {
    getExtension,
    verifyType,
    parseLyrics,
    writeLyrics
};