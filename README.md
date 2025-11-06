# Another Boring File Classifier

A Node.js command-line tool to organize images, videos, and other files by date into structured directories.

This tool is designed to classify smartphone backup files, organizing them into a structured tree by file type and dates. It has been specifically created for use within Synology NAS environments, providing an efficient way to manage large collections of media files from mobile device backups.

This script has been entirely created with Claude Sonnet 4 AI.

## Features

- 📁 Recursively processes directories and subdirectories
- 📸 Organizes images by EXIF metadata dates
- 🎥 Organizes videos by file creation/modification dates
- 📄 Handles other file types with fallback date extraction
- 🐛 Debug mode for testing without moving files
- 📊 Progress reporting and statistics
- ⏭️ Skips directories starting with '@' symbol
- 🔀 Handles filename conflicts with unique identifiers

## Installation

```bash
npm install
```

## Usage

```bash
# Basic usage
npm start <source-directory> <destination-directory>

# With debug mode (shows operations without moving files)
npm start <source-directory> <destination-directory> --debug

# If installed globally
npx another-boring-file-classifier <source-directory> <destination-directory> [--debug]
```

## Directory Structure

The tool organizes files into the following structure:
```
destination/
├── photos/
│   ├── 2023/
│   │   ├── 01/
│   │   ├── 02/
│   │   └── ...
│   └── undate/
├── videos/
│   ├── 2023/
│   │   ├── 01/
│   │   └── ...
│   └── undate/
└── others/
    ├── 2023/
    │   └── ...
    └── undate/
```

## Supported File Types

### Images
- `.jpg`, `.jpeg`, `.png`, `.gif`, `.bmp`, `.tiff`, `.tif`, `.webp`, `.heic`, `.heif`
- Date extraction from EXIF metadata (DateTimeOriginal, DateTime, CreateDate, ModifyDate)

### Videos
- `.mp4`, `.avi`, `.mov`, `.mkv`, `.wmv`, `.flv`, `.webm`, `.m4v`, `.3gp`
- Date extraction from file system dates

### Others
- All other file types
- Date extraction from file system creation/modification dates

## Special Behaviors

- **Directory Skipping**: Directories starting with '@' are automatically skipped
- **File Conflicts**: When a file with the same name exists, a random ID is prepended to avoid conflicts
- **Date Fallback**: Uses the earlier of creation or modification dates when metadata is unavailable

## Examples

```bash
# Organize photos from camera folder
npm start ./DCIM ./organized-photos

# Preview organization without moving files
npm start ./Downloads ./organized --debug

# Process large directory structure
npm start /media/photos /backup/organized-photos
```

## Requirements

- Node.js >= 14.0.0
- Write permissions to destination directory

## Dependencies

- `exifr`: EXIF metadata extraction from images
- `commander`: Command-line interface
- `chalk`: Colored console output
- `node-ffprobe`: Video metadata extraction (future enhancement)

## License

MIT
