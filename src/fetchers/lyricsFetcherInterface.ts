export interface LyricsFetcher {
    getLyrics: (artist: string, title: string) => Promise<string>
}
