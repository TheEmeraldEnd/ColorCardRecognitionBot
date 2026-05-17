import fs from 'fs/promises';

export async function ReadFile(incomingPathString = "") {
    let data = await fs.readFile(incomingPathString);
    return await data.toString();
}

export function IsFileExist(incomingPathString = "") {
    return await fs.exists(incomingPathString);
}

export function IsDirectoryExist(incomingPathString = "") {
    return await fs.exists(incomingPathString)
}