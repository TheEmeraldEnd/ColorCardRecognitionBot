const fs = require('node:fs');

export default class FileReader{
    static async ReadFromFile(incomingPathString = ""){
        let content = fs.readFile(incomingPathString)
        return content;
    }
}