const fs = require('fs').promises;
const path = require('path');
const exifr = require('exifr');

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.tif', '.webp', '.heic', '.heif'];
const VIDEO_EXTENSIONS = ['.mp4', '.avi', '.mov', '.mkv', '.wmv', '.flv', '.webm', '.m4v', '.3gp'];

function getFileType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  
  if (IMAGE_EXTENSIONS.includes(ext)) {
    return 'image';
  } else if (VIDEO_EXTENSIONS.includes(ext)) {
    return 'video';
  } else {
    return 'other';
  }
}

async function getFileDate(filePath) {
  const fileType = getFileType(filePath);
  
  try {
    // Try to extract metadata date first
    if (fileType === 'image') {
      const exifData = await exifr.parse(filePath);
      if (exifData) {
        // Try different EXIF date fields
        const dateFields = ['DateTimeOriginal', 'DateTime', 'CreateDate', 'ModifyDate'];
        for (const field of dateFields) {
          if (exifData[field] && exifData[field] instanceof Date) {
            return exifData[field];
          }
        }
      }
    } else if (fileType === 'video') {
      // For videos, we'll rely on file system dates for now
      // Could be enhanced with ffprobe for metadata extraction
    }
  } catch (error) {
    // If metadata extraction fails, fall back to file system dates
  }

  // Fall back to file system dates
  try {
    const stats = await fs.stat(filePath);
    // Compare birthtime (creation) and mtime (modification), use the earlier one
    const birthtime = stats.birthtime;
    const mtime = stats.mtime;
    
    if (birthtime && mtime) {
      return birthtime < mtime ? birthtime : mtime;
    }
    return birthtime || mtime;
  } catch (error) {
    return null;
  }
}

async function generateUniqueFilename(destDir, originalFilename) {
  const fullPath = path.join(destDir, originalFilename);
  
  try {
    // Check if file already exists
    await fs.access(fullPath);
    
    // File exists, generate unique name
    const ext = path.extname(originalFilename);
    const nameWithoutExt = path.basename(originalFilename, ext);
    const randomId = Math.random().toString(36).substring(2, 8);
    const newFilename = `${randomId}_${nameWithoutExt}${ext}`;
    
    // Recursively check if the new name also exists
    return await generateUniqueFilename(destDir, newFilename);
  } catch (error) {
    // File doesn't exist, use original name
    return fullPath;
  }
}

module.exports = { getFileType, getFileDate, generateUniqueFilename };
