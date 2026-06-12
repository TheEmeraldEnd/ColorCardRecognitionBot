import * as FileHandler from "./FileHandler.js"

const BOT_SAVE_PATH = "../BotRelated/SavedBots";

// export function SaveModel(modelName = "", jsonContent = ""){
//     FileHandler.WriteToFile(GetSaveFileName(modelName), jsonContent);
// }

export function SaveModel(incomingModelName = "", incomingWeights = [], incomingActivationFunctions = []){
    let nameAndPath = `${BOT_SAVE_PATH}/${incomingModelName}.txt`;
    let content = `${new SaveModelClass(incomingModelName, incomingWeights, incomingActivationFunctions).ToJSON()}`
    FileHandler.WriteToFile(nameAndPath, content);
}

class SaveModelClass{
    constructor(incomingModelName = "", incomingWeights = [], incomingActivationFunctions = []){
        this.modelName = incomingModelName;
        this.incomingWeights = incomingWeights;
        this.activationFunctions = incomingActivationFunctions;
    }

    ToJSON(){
        return JSON.stringify(this);
    }
}

function GetSaveFileName(modelName = ""){
    return `${BOT_SAVE_PATH}/${modelName}.txt`;
}

export function GetAllSavedBotsNamesAndPaths(){
    let result = FileHandler.ReadDirectoryContent(BOT_SAVE_PATH);
    for(let i = 0; i < result.length; i++){
        
        result[i] = `${BOT_SAVE_PATH}/${result[i]}`;
    }
    return result;
}

export function GetAllSavedBotsNames(){
    let result = FileHandler.ReadDirectoryContent(BOT_SAVE_PATH);

    for(let i = 0; i < result.length; i++){
        result[i] = result[i].replace(".txt", "");
    }
    return result;
}

export function GetJSONOfModel(incomingModelName = ""){
    if (!IsModelSaved(incomingModelName)){
        console.error(`Stopped loading as JSON of ${incomingModelName} doesn't exist.`);
    }

    let modelJSONPath = GetSaveFileName(incomingModelName);

    let modelJSON = FileHandler.ReadFromFile(modelJSONPath);

    return modelJSON;
}

export function IsModelSaved(incomingModelName = ""){
    return GetAllSavedBotsNames().includes(incomingModelName);
}