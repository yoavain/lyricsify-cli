# Lyrics Downloader  <br>

## A tool for downloading Hebrew lyrics from Shironet

### Migrate mode
Import lyrics for file headers into the database

### Plex mode
Write `.txt` file with the lyrics next to the audio file

### Dry-run mode
Run without making changes to your file system

### Quiet mode
Run without notifications

### Local mode
Run without calling Shironet

## Installer

Installer adds right-click context to folders and to mp3/flac file types

## Usage

### Right click file/folder
Runs on file/folder using configuration from `%ProgramData%\lyricsify\lyricsify.env`


### CLI

Usage example:

```
lyricsify.exe <filename>

Options:
  -v, --verbose    print additional logs                               [boolean]
  -d, --dry-run    dry-run                                             [boolean]
  -p, --plex-mode  plex-mode                                           [boolean]
  -m, --migrate    migrate                                             [boolean]
  -l, --local      local                                               [boolean]
  -q, --quiet      quiet                                               [boolean]
      --version    Show version number                                 [boolean]
      --help       Show help                                           [boolean]
```  

---

## To build:

 * npm install
 * npm run build
