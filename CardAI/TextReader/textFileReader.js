import * as fs from 'fs';

export default class FileReader{
    constructor(){

    }
    static ReadFromFile(incomingPathString = ""){
        let content = fs.readFile(incomingPathString)
        return content;
    }
}