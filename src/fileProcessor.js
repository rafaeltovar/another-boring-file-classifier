const fs = require('fs').promises;
const path = require('path');
const chalk = require('chalk');
const { getFileDate, getFileType, generateUniqueFilename } = require('./utils');

async function processDirectory(sourceDir, destDir, debugMode = false) {
  const stats = { images: 0, videos: 0, others: 0, errors: 0 };

  async function processRecursively(currentDir) {
    try {
      const entries = await fs.readdir(currentDir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);

        if (entry.isDirectory()) {
          // Skip directories that start with '@'
          if (entry.name.startsWith('@')) {
            console.log(chalk.yellow(`⏭️  Skipping directory: ${fullPath}`));
            continue;
          }
          await processRecursively(fullPath);
        } else if (entry.isFile()) {
          try {
            await processFile(fullPath, destDir, debugMode, stats);
          } catch (error) {
            console.error(chalk.red(`❌ Error processing ${fullPath}:`), error.message);
            stats.errors++;
          }
        }
      }
    } catch (error) {
      console.error(chalk.red(`❌ Error reading directory ${currentDir}:`), error.message);
      stats.errors++;
    }
  }

  await processRecursively(sourceDir);
  
  console.log(chalk.cyan('\n📊 Summary:'));
  console.log(`Images: ${stats.images}, Videos: ${stats.videos}, Others: ${stats.others}, Errors: ${stats.errors}`);
}

async function processFile(filePath, destDir, debugMode, stats) {
  const fileType = getFileType(filePath);
  const fileDate = await getFileDate(filePath);
  
  let targetSubdir;
  if (fileDate) {
    const year = fileDate.getFullYear();
    const month = String(fileDate.getMonth() + 1).padStart(2, '0');
    targetSubdir = `${year}/${month}`;
  } else {
    targetSubdir = 'undate';
  }

  let categoryDir;
  switch (fileType) {
    case 'image':
      categoryDir = 'photos';
      stats.images++;
      break;
    case 'video':
      categoryDir = 'videos';
      stats.videos++;
      break;
    default:
      categoryDir = 'others';
      stats.others++;
  }

  const finalDestDir = path.join(destDir, categoryDir, targetSubdir);
  const fileName = path.basename(filePath);
  
  // Generate unique filename if collision exists
  const finalDestPath = await generateUniqueFilename(finalDestDir, fileName);

  // Log the operation
  const dateStr = fileDate ? fileDate.toISOString().split('T')[0] : 'unknown';
  console.log(chalk.green(`📄 ${fileType.toUpperCase()}`), 
              chalk.gray(`[${dateStr}]`), 
              chalk.blue(filePath), 
              chalk.gray('→'), 
              chalk.blue(finalDestPath));

  if (!debugMode) {
    // Create destination directory if it doesn't exist
    await fs.mkdir(finalDestDir, { recursive: true });
    
    // Move the file
    await fs.rename(filePath, finalDestPath);
  }
}

module.exports = { processDirectory };
