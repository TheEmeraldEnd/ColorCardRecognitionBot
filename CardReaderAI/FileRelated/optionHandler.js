import * as FileHandler from './fileHandler.js'

const optionsPath = '../DataPrepper/DataDefaults/Data_Options'
const optionExtension = '.png';
export function GetOptionPath(){
    return optionsPath;
}

function GetOptionExtension(){
    return ".png";
}

export function GetOptionNames(){
    if (!FileHandler.IsFileOrDirectoryExist(optionsPath)){
        console.log(`Dir or file ${optionsPath} does not exist`);
        return;
    }

    let optionNames = GetOptionNamesWithExtension();

    for(let i = 0; i < optionNames.length; i++){
        optionNames[i] = optionNames[i].replace(optionExtension, "");
    }

    return optionNames;
}

export function GetOptionNamesWithExtension(){
    let optionNames = FileHandler.ReadDirectoryContent(optionsPath);
    

    return optionNames;
}

export function GetOptionNamesWithRelativePathAndExtension(){
    let optionNames = GetOptionNamesWithExtension();
    
    for(let i = 0; i < optionNames.length; i++){
        optionNames[i] = `${optionsPath}/${optionNames[i]}`;
    }
    
    return optionNames;
}

export function DisplayOptionsInConsole(incomingOptionNamesStringArray){
    if (incomingOptionNamesStringArray.length <= 0){
        console.log('Please add more array elements');
        return;
    }

    incomingOptionNamesStringArray.forEach(name =>{
        console.log(`${name}`);
    });
    return;
}