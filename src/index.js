#!/usr/bin/env node
// filepath: /home/rafa/Projects/rafaeltovar-order-images/src/index.js

const { Command } = require('commander');
const chalk = require('chalk');
const { processDirectory } = require('./fileProcessor');

const program = new Command();

program
  .name('order-images')
  .description('Organize images, videos and other files by date into structured directories')
  .version('1.0.0')
  .argument('<source>', 'Source directory to read files from')
  .argument('<destination>', 'Destination directory to organize files into')
  .option('--debug', 'Show operations without actually moving files')
  .action(async (source, destination, options) => {
    try {
      console.log(chalk.blue('📁 Starting file organization...'));
      console.log(chalk.gray(`Source: ${source}`));
      console.log(chalk.gray(`Destination: ${destination}`));
      
      if (options.debug) {
        console.log(chalk.yellow('🐛 DEBUG MODE: Files will not be moved physically'));
      }

      await processDirectory(source, destination, options.debug);
      
      console.log(chalk.green('✅ File organization completed!'));
    } catch (error) {
      console.error(chalk.red('❌ Error:'), error.message);
      process.exit(1);
    }
  });

program.parse();