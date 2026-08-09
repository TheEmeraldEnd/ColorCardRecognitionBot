import * as ActivationFunctions from "./MachineLearningRelated/ActivationFunctions.js";
import * as Presets from "./ConsoleCommands/Presets.js";

import * as SinlgeBotConsoleCommands from "./ConsoleCommands/SingleBotConsoleCommands.js";
import * as GroupBotConsoleCommands from "./ConsoleCommands/GroupBotsConsoleCommands.js";

let testBotNameOrGroupName = "TestBot";

let isGroupTesting = true;

let isMonochrome = false;

let isDeleteBeforeRun = true;

let totalEpochAmount = 1000;
let epochLogIteration = 10;
let dataGroupAmount = 20;

let hiddenLayerActivationFunction = ActivationFunctions.GetRelu();
let outputLayerActivationFunction = ActivationFunctions.GetSigmoid();

if (isGroupTesting === false) {
	let isTestOnTrainingData = false;

	let amountOfHiddenLayers = 2;

	await SinlgeBotConsoleCommands.TrainThenRun(
		testBotNameOrGroupName,
		isTestOnTrainingData,
		totalEpochAmount,
		epochLogIteration,
		dataGroupAmount,
		amountOfHiddenLayers,
		hiddenLayerActivationFunction,
		outputLayerActivationFunction,
		isMonochrome,
		isDeleteBeforeRun,
	);
} else {
	let amountOfBots = 2;
	let amountOfHiddenLayers = 2;

	let isTestOnTrainingData = false;

	let evaluationCacheAmount = 2;

	let isDeleteLowest = true;
	let isApplyCrossover = false;

	let mutationChance = 0.1;
	let mutationVariation = 0.1;

	await GroupBotConsoleCommands.RunGroupBots(
		testBotNameOrGroupName,
		amountOfBots,
		amountOfHiddenLayers,
		isMonochrome,
		isDeleteBeforeRun,
		isTestOnTrainingData,
		evaluationCacheAmount,
		totalEpochAmount,
		epochLogIteration,
		dataGroupAmount,
		isDeleteLowest,
		isApplyCrossover,
		mutationChance,
		mutationVariation,
		hiddenLayerActivationFunction,
		outputLayerActivationFunction,
	);
}
