import * as fh from './FileRelated/FileHandler.js';

console.log("Things")
let filePath = '../DataRelated/Data/Data_Training/Data_Histogram_Monochrome/1627594724.txt'
//let isFileExist = await fh.IsFileExist(filePath);
//console.log(isFileExist);
let content = await fh.ReadFile(filePath);
console.log(content);
