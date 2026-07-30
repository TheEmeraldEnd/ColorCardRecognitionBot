import fs from 'fs';

export function Test(){
    console.log('fileHandler test successful');
}

export function DeleteFileIfExists(fileNameAndPathExtension = ''){
    if (!IsFileOrDirectoryExist(fileNameAndPathExtension))
        return;

    fs.unlinkSync(fileNameAndPathExtension, (err) => {
        if (err) throw err;
        console.log('File Deleted Successfully');
    })
}

//If file exists, overrite it
export function WriteToFile(fileNamePathExtension = "", fileContent = ""){
    try{
        fs.writeFileSync(fileNamePathExtension, fileContent);
        console.log(`Saved accuracy content to ${fileNamePathExtension}`)
    }
    catch(error){
        console.error(error);
    }
}

export function ReadFromFile(incomingPathString = ""){
    if (!IsFileOrDirectoryExist(incomingPathString)){
        console.log(`File ${incomingPathString} doesn't exist`);
        return;
    }
    
    let data =  fs.readFileSync(incomingPathString);
    return data.toString();
}

export function IsDirectory(incomingPathString){
    return fs.statSync(incomingPathString).isDirectory();
}

export function IsFileOrDirectoryExist(incomingPathString = ""){
    return fs.existsSync(incomingPathString);
}

export function ReadDirectoryContent(incomingPathString = ""){
    if (!IsFileOrDirectoryExist(incomingPathString)){
        console.log("Not a valid path")
        return;
    }

    if (!IsDirectory(incomingPathString)){
        console.log(`set path is not a directory (${incomingPathString})`);
        return;
    }
    
    let content = fs.readdirSync(incomingPathString)
    return content;
}

export function ReadDirectoryContentCosole(incomingPathString = ""){

    if (!IsFileOrDirectoryExist(incomingPathString)){
        console.log("Not a valid path")
        return;
    }

    if (!IsDirectory(incomingPathString)){
        console.log(`set path is not a directory (${incomingPathString})`);
        return;
    }

    let contentList = ReadDirectoryContent(incomingPathString);
    console.log(`/// File names for ${incomingPathString} ///`)
    contentList.forEach(fileName => {
        console.log(fileName);
    })
    console.log(`///////////////////////////////////`)
}