import fs from 'fs/promises';

export async function ReadFile(incomingPathString = "") {
    let data = await fs.readFile(incomingPathString);
    return await data.toString();
}