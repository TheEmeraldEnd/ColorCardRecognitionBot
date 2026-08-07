import * as FileHandler from "./FileRelated/fileHandler.js";
import * as HistogramHandler from "./FileRelated/histogramHandler.js";
import * as OptionsHandler from "./FileRelated/optionHandler.js";

import * as MLHandler from "./MachineLearningRelated/MLHandler.js";
import * as tf from "@tensorflow/tfjs";

import * as DataHolder from "./DataRelated/DataHolder.js";
import * as DataTranslator from "./DataRelated/DataTranslator.js";
import * as DataComparer from "./DataRelated/DataComparer.js";

import * as MathExtension from "./MathRelated/MathFunctions.js";

import * as MLGroupHandler from "./MachineLearningRelated/GroupMLHandler.js";

import * as WeightRandomizer from "./MachineLearningRelated/WeightRandomizer.js";
import * as ActivationFunctions from "./MachineLearningRelated/ActivationFunctions.js";

import * as SinlgeBotConsoleCommands from "./ConsoleCommands/SingleBotConsoleCommands.js";
import * as GroupBotConsoleCommands from "./ConsoleCommands/GroupBotsConsoleCommands.js";

/* TODO: NEED TO TEST botGroup.RunThroughGeneticGenerations
 on line 103 in GroupBotsConsoleCommands.js.
 */

let testBotNameOrGroupName = "TestBot";

let isGroupTesting = true;

let isMonochrome = false;

if (isGroupTesting === false) {
	let isTestOnTrainingData = false;

	let totalEpochAmount = 1000;
	let epochLogIteration = 10;
	let dataGroupAmount = 20;

	let amountOfHiddenLayers = 2;
	let hiddenLayerActivationFunction = ActivationFunctions.GetRelu();
	let outputLayerActivationFunction = ActivationFunctions.GetSigmoid();

	await SinlgeBotConsoleCommands.TrainNewThenRun(
		testBotNameOrGroupName,
		isTestOnTrainingData,
		totalEpochAmount,
		epochLogIteration,
		dataGroupAmount,
		amountOfHiddenLayers,
		hiddenLayerActivationFunction,
		outputLayerActivationFunction,
		isMonochrome,
	);
} else {
	let amountOfBots = 2;
	let amountOfHiddenLayers = 2;

	let isDeleteBeforeTrain = true;

	let isTestOnTrainingData = true;

	let amountOfGenerations = 2;

	await GroupBotConsoleCommands.RunGroupBots(
		testBotNameOrGroupName,
		amountOfBots,
		amountOfHiddenLayers,
		isMonochrome,
		isDeleteBeforeTrain,
		isTestOnTrainingData,
		amountOfGenerations,
	);
}

//#region Single Bot training

//#endregion

// let trainingHistograms = HistogramHandler.MonochromeClass.GetAllHistograms();
// let formattedTrainingData = DataHolder.DataHolder.InitializeNewDataHolder(
// 	trainingHistograms,
// 	OptionsHandler.GetOptionNames(),
// );

// let numberOfInputNodes = formattedTrainingData.GetLengthsOfRawColorArray();
// let numberOfOutputNodes = formattedTrainingData.GetPossibleOptionsLength();

// let totalHiddenNodes =
// 	MLHandler.HiddenNodeRecommender.GetHiddenNodesBySimpleMethod(
// 		numberOfInputNodes,
// 		numberOfOutputNodes,
// 	);
// let hiddenLayerAmmount = 2;
// let hiddenNodesPerLayer =
// 	MLHandler.HiddenNodeRecommender.SetNumberOfHiddenNodesByLayer(
// 		totalHiddenNodes,
// 		hiddenLayerAmmount,
// 	);

//#region Group training
// let testGroupName = 'AlotaBots';
// let amountOfBotsTested = 10;
// let botGroup = new MLGroupHandler.GroupMachineClass(
// 	amountOfBotsTested,
// 	testGroupName,
// );

// let hiddenActivationFunction = ActivationFunctions.GetRelu();
// let finalActivationFunction = ActivationFunctions.GetSigmoid();

// botGroup.ConfigureModel(
// 	numberOfInputNodes,
// 	hiddenNodesPerLayer,
// 	numberOfOutputNodes,
// 	hiddenActivationFunction,
// 	finalActivationFunction,
// );

// botGroup.GetSummary();

// botGroup.CompileMachines();

// await botGroup.FitDataWithBatching(
// 	formattedTrainingData.GetRawColorDataAsTensor(),
// 	DataTranslator.BinaryTranslator.LabelsToIndexesTensor(
// 		formattedTrainingData.GetLabelsAsArray(),
// 		formattedTrainingData.GetOptionNames(),
// 	),
// 	formattedTrainingData.GetOptionNames(),
// 	20,
// 	10,
// 	5,
// );

// botGroup.GetSummary();
// // let predictionTensor = botGroup.bots[0].predict(formattedTrainingData.GetRawColorDataAsTensor())
// // let predictedLabels = DataTranslator.BinaryTranslator.IndexesToLabels(
// //         predictionTensor.arraySync(),
// //         formattedTrainingData.GetOptionNames());
// // let actualLabels = formattedTrainingData.GetLabelsAsArray();
// // botGroup.bots[0].LogAccuracy(
// //     predictedLabels,
// //     actualLabels);

// //Get prediction tensors
// let predictionTensors = botGroup.PredictAll(
// 	formattedTrainingData.GetRawColorDataAsTensor(),
// );

// let predictedLabelses = [];
// for (let i = 0; i < predictionTensors.length; i++) {
// 	predictedLabelses.push(
// 		DataTranslator.BinaryTranslator.IndexesToLabels(
// 			predictionTensors[i].arraySync(),
// 			formattedTrainingData.GetOptionNames(),
// 		),
// 	);
// }

// let actualLabels = formattedTrainingData.GetLabelsAsArray();

// //botGroup.PredictAllAndSort(predictedLabelses, actualLabels);

// botGroup.SaveGroup()
// botGroup = MLGroupHandler.GroupMachineClass.LoadGroup(testGroupName);
//#endregion
