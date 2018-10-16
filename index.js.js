/*jslint node: true */
"use strict";
const fs = require('fs');
const path = require('path');
const getFolderSize = require('get-folder-size');

const DEFAULT_720P_DIR = 'M:/Video/Movies';
const DEFAULT_1080P_DIR = 'R:/Video/Movies';
const MOVIE_DIRECTORIES = [DEFAULT_720P_DIR, DEFAULT_1080P_DIR];

const DIRECTORIES = MOVIE_DIRECTORIES;

DIRECTORIES.forEach(directory => {

  fs.readdir(directory, (error, folders) => {

    if (error) return console.log(error);

    folders.forEach(folder => {

      let folderDir = path.join(directory, folder);

      // Remove empty directories
      // removeEmptyDirectory(folderDir);

      // Rename movie directories with YTS
      renameMovieFolder(folderDir);
    });

  });
});

function renameMovieFolder(folderDir) {
  let name = path.basename(folderDir);
  const YTS_REGEX = /\s\[YTS.A\w\]/ig;
  let isYTS = YTS_REGEX.test(name);
  if (isYTS) {
    let newName = name.replace(YTS_REGEX, '');
    let newFolderDir = path.join(path.dirname(folderDir), newName);
    fs.renameSync(folderDir, newFolderDir);
    console.log(`* Renamed ${name} to ${newName}`);
  }
}

function removeEmptyDirectory(folderDir) {
  getFolderSize(folderDir, (err, size) => {
    if (err) console.log('ERROR: ', err);

    if (size === 0) {

      let otherFolder = path.join(folderDir, 'Other');
      if (fs.existsSync(otherFolder)) {
        fs.rmdirSync(otherFolder);
      }
      fs.rmdirSync(folderDir);
      console.log('-', file, ' size: ', size, ' bytes');
    }
  });
}