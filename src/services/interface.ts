export type GetLyrics = (artist: string, track: string) => Promise<string>

export interface LyricsService {
    getLyrics: GetLyrics
}
