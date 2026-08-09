import * as ActivationFunctions from './MachineLearningRelated/ActivationFunctions.js';
import * as Presets from './ConsoleCommands/Presets.js';

import * as SinlgeBotConsoleCommands from './ConsoleCommands/SingleBotConsoleCommands.js';
import * as GroupBotConsoleCommands from './ConsoleCommands/GroupBotsConsoleCommands.js';

//Don't use crossover (doesn't work)
const PRESET = Presets.DEFAULT_PRESETS.GROUP_MUTATION_ONLY_OVERFIT;

let nameOrGroupName = PRESET.GetName();

let isGroupTesting = PRESET.GetIsGroupTest();

let isMonochrome = PRESET.GetIsMonochrome();

let isDeleteBeforeRun = PRESET.GetIsDeleteBeforeRun();

let totalEpochAmount = PRESET.GetTotalEpochAmount();
let epochLogIteration = PRESET.GetEpochLogIteration();
let dataGroupAmount = PRESET.GetDataGroupAmount();

let hiddenLayerActivationFunction = PRESET.GetHiddenActivation();
let outputLayerActivationFunction = PRESET.GetOutputActivation();

let isTestOnTrainingData = PRESET.GetIsTestOnTrainingData();

let amountOfHiddenLayers = PRESET.GetAmountOfBots();

if (isGroupTesting === false) {
	await SinlgeBotConsoleCommands.TrainThenRun(
		nameOrGroupName,
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
	let amountOfBots = PRESET.GetAmountOfBots();

	let evaluationCacheAmount = PRESET.GetEvalCacheAmount();

	let isDeleteLowest = PRESET.GetIsDeleteLowest();
	let isApplyCrossover = PRESET.GetIsApplyCrossover();

	let mutationChance = PRESET.GetMutationChance();
	let mutationVariation = PRESET.GetMutationVariation();

	await GroupBotConsoleCommands.RunGroupBots(
		nameOrGroupName,
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
