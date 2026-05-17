import FileReader from "./TextReader/textFileReader.js";

let testPathString = "../DataRelated/Data/Data_Training/Data_Histogram_Monochrome/83765675.txt"
let contentString = FileReader.ReadFromFile(testPathString);
console.log(contentString);