import { ReadFile } from './FileRelated/FileHandler.js';

console.log("Things")
let content = await ReadFile('../DataRelated/Data/Data_Training/Data_Histogram_Monochrome/1627594724.txt');
console.log(content);
