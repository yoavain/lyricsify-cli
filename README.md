# ![](https://raw.githubusercontent.com/yoavain/lyricsify-cli/main/resources/icons/64x64_logo.png) Lyricsify - Lyrics Downloader  <br>

[![Total alerts](https://img.shields.io/lgtm/alerts/g/yoavain/lyricsify-cli.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/yoavain/lyricsify-cli/alerts/)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/yoavain/lyricsify-cli.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/yoavain/lyricsify-cli/context:javascript)
[![Actions Status](https://github.com/yoavain/lyricsify-cli/workflows/Node%20CI/badge.svg)](https://github.com/yoavain/lyricsify-cli/actions)
![types](https://img.shields.io/npm/types/typescript.svg)
![commit](https://img.shields.io/github/last-commit/yoavain/lyricsify-cli.svg)
[![Known Vulnerabilities](https://snyk.io//test/github/yoavain/lyricsify-cli/badge.svg?targetFile=package.json)](https://snyk.io//test/github/yoavain/lyricsify-cli?targetFile=package.json)
[![codecov](https://codecov.io/gh/yoavain/lyricsify-cli/branch/main/graph/badge.svg?token=38TTECCCWS)](https://codecov.io/gh/yoavain/lyricsify-cli)
[![Renovate](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com)
![visitors](https://visitor-badge.glitch.me/badge?page_id=yoavain.lyricsify-cli)

## A tool for downloading Hebrew lyrics from Shironet

### Save header
Save lyrics to the file header

### Save txt (AKA. Plex mode)
Write `.txt` file with the lyrics next to the audio file. 

### Dry-run
Run without making changes to your file system

### Skip backup
Skip backup of the original file

### Quiet
Run without notifications

### Offline
Run without fetching lyrics from internet

### Verbose
Run with more information

## Installer

Installer adds right-click context to folders and to mp3/flac file types

## Usage

### Right click file/folder
Runs on file/folder using configuration from `%ProgramData%\lyricsify\lyricsify.env`

```dotenv
# Write lyrics to file header
LYRICSIFY_SAVE_HEADER=false

# Writes .txt file next to the audio file (i.e. /path/to/audio.mp3 -> /path/to/audio.txt)
LYRICSIFY_SAVE_TXT=true

# Do not save lyrics to a local database
LYRICSIFY_DISABLE_CACHE=false

# Do not fetch lyrics from the web
LYRICSIFY_OFFLINE=false

# Do not make any changes to files
LYRICSIFY_DRY_RUN_MODE=false

# Do not create a backup of the original file (use at your own risk)
LYRICSIFY_SKIP_BACKUP=false

# Disables notifications
LYRICSIFY_QUIET_MODE=false

# Verbose mode: Extra prints to log
LYRICSIFY_VERBOSE_MODE=false
```

### CLI

Usage:

```
lyricsify.exe <filename>

  filename  file or folder to handle                                    [string]

Options:
  -s, --save-header    save lyrics in file header                      [boolean]
  -t, --save-txt       save lyrics to a txt file                       [boolean]
  -p, --disable-cache  do not cache lyrics                             [boolean]
  -l, --offline        do not download lyrics                          [boolean]
  -d, --dry-run        not making any changes to files                 [boolean]
  -x, --skip-backup    do not backup original file                     [boolean]
  -q, --quiet          disable notifications                           [boolean]
  -v, --verbose        print additional logs                           [boolean]
      --version        Show version number                             [boolean]
      --help           Show help                                       [boolean]
```

examples:
```
lyricsify.exe "X:\\Music\\song.mp3" --save-header --save-txt

lyricsify.exe "X:\\Music\\" --quiet --save-txt
```
---

## To build

 * npm install
 * npm run build


## Flow

[Flow](./docs/FLOW.md)
