# ![](https://raw.githubusercontent.com/yoavain/lyricsify-cli/main/resources/icons/64x64.png) Lyrics Downloader  <br>

[![Total alerts](https://img.shields.io/lgtm/alerts/g/yoavain/lyricsify-cli.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/yoavain/lyricsify-cli/alerts/)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/yoavain/lyricsify-cli.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/yoavain/lyricsify-cli/context:javascript)
[![Actions Status](https://github.com/yoavain/lyricsify-cli/workflows/Node%20CI/badge.svg)](https://github.com/yoavain/lyricsify-cli/actions)
![types](https://img.shields.io/npm/types/typescript.svg)
![commit](https://img.shields.io/github/last-commit/yoavain/lyricsify-cli.svg)
[![Known Vulnerabilities](https://snyk.io//test/github/yoavain/lyricsify-cli/badge.svg?targetFile=package.json)](https://snyk.io//test/github/yoavain/lyricsify-cli?targetFile=package.json)
[![codecov](https://codecov.io/gh/yoavain/lyricsify-cli/branch/main/graph/badge.svg)](https://codecov.io/gh/yoavain/lyricsify-cli)
[![Renovate](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com)
![visitors](https://visitor-badge.glitch.me/badge?page_id=yoavain.lyricsify-cli)

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
