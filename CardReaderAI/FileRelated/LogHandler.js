import * as FileHandler from "./FileHandler.js";


const LOG_FILES_PATH = "../BotRelated/Logs/AccuracyLogs";

export function SaveAccuracyLog(nameOfBot = "", contentOfLog = ""){
    FileHandler.WriteToFile(MakeLogTitle(nameOfBot), contentOfLog);
}

function MakeLogTitle(nameOfBot = ""){
    return `${LOG_FILES_PATH}/${new Date().toISOString().replaceAll(':', " ").replaceAll('.', ' ')} [${nameOfBot}].txt`
}