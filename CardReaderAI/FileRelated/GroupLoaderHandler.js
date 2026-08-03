import * as FileHandler from "./FileHandler.js";

//TODO: Need to test all of these
const GROUP_BOT_SAVE_PATH = "../BotRelated/SavedGroups";

export function SaveGroup(groupName = "", jsonContent = "") {
  FileHandler.WriteToFile(GetSaveFileName(groupName), jsonContent);
}

export function DeleteGroupIfExists(groupName = "") {
  if (IsGroupSaved(groupName)) {
    FileHandler.DeleteFileIfExists(GetSaveFileName(groupName));
  }
}

export function LoadGroupJSON(groupName = "") {
  if (!IsGroupSaved(groupName)) {
    console.log(`Group name ${groupName} doesn't exist!`);
    return "";
  }

  let dataJSON = GetJSONOfGroup(groupName);

  return dataJSON;
}

export function IsGroupSaved(incomingGroupName = "") {
  return FileHandler.IsFileOrDirectoryExist(GetSaveFileName(incomingGroupName));
}

function GetSaveFileName(groupName = "") {
  return `${GROUP_BOT_SAVE_PATH}/${groupName}.txt`;
}

export function GetAllSavedGroupNamesAndPaths() {
  let result = FileHandler.ReadDirectoryContent(GROUP_BOT_SAVE_PATH);
  for (let i = 0; i < result.length; i++) {
    result[i] = `${GROUP_BOT_SAVE_PATH}/${result[i]}`;
  }
  return result;
}

export function GetAllSavedGroupNames() {
  let result = FileHandler.ReadDirectoryContent(GROUP_BOT_SAVE_PATH);

  for (let i = 0; i < result.length; i++) {
    result[i] = result[i].replace(".txt", "");
  }
  return result;
}

export function GetJSONOfGroup(incomingGroupName = "") {
  if (!IsGroupSaved(incomingGroupName)) {
    console.error(
      `Stopped loading as JSON of ${incomingGroupName} doesn't exist.`,
    );
  }

  let modelJSONPath = GetSaveFileName(incomingGroupName);

  let modelJSON = FileHandler.ReadFromFile(modelJSONPath);

  return modelJSON;
}
