import * as FileHandler from './FileHandler.js';

const LOG_FILES_PATH = '../BotRelated/Logs/AccuracyLogs';

const GROUP_FILES_PATH = '../BotRelated/Logs/GroupAccuracyLogs';

export function SaveAccuracyLog(nameOfBot = '', contentOfLog = '') {
	FileHandler.WriteToFile(
		MakeLogTitle(nameOfBot, LOG_FILES_PATH),
		contentOfLog,
	);
}

export function SaveGroupAccuracyLog(
	nameOfGroupOfBots = '',
	contentOfLog = '',
) {
	FileHandler.WriteToFile(
		MakeLogTitle(nameOfGroupOfBots, GROUP_FILES_PATH),
		contentOfLog,
	);
}

function MakeLogTitle(nameOfBot = '', pathOfLogFiles = '') {
	return `${pathOfLogFiles}/${new Date().toISOString().replaceAll(':', ' ').replaceAll('.', ' ')} [${nameOfBot}].txt`;
}
