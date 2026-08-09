import * as FileHandler from '../FileRelated/FileHandler.js';
import * as HistogramHandler from '../FileRelated/histogramHandler.js';
import * as OptionsHandler from '../FileRelated/optionHandler.js';

import * as MLHandler from '../MachineLearningRelated/MLHandler.js';
import * as tf from '@tensorflow/tfjs';

import * as DataHolder from '../DataRelated/DataHolder.js';
import * as DataTranslator from '../DataRelated/DataTranslator.js';
import * as DataComparer from '../DataRelated/DataComparer.js';

import * as MathExtension from '../MathRelated/MathFunctions.js';

import * as MLGroupHandler from '../MachineLearningRelated/GroupMLHandler.js';

import * as WeightRandomizer from '../MachineLearningRelated/WeightRandomizer.js';
import * as ActivationFunctions from '../MachineLearningRelated/ActivationFunctions.js';

import {
	DeleteGroupIfExists,
	IsGroupSaved,
} from '../FileRelated/GroupLoaderHandler.js';

export async function RunGroupBots(
	incomingGroupName = '',
	amountOfBots = 2,
	amountOfHiddenLayers = 2,
	isMonochrome = true,
	isDeleteBeforeTrain = false,
	isTestOnTrainingData = true,
	evaluationCacheAmount = 10,
	totalEpochAmount = 20,
	epochLogIteration = 10,
	dataGroupAmount = 5,
	isDeleteLowest = true,
	isApplyCrossover = false,
	mutationChance = 0.1,
	mutationVariation = 0.1,
	hiddenLayerActivationFunction = ActivationFunctions.GetRelu(),
	outputLayerActivationFunction = ActivationFunctions.GetSigmoid(),
) {
	//#region Format the training and final data
	let formattedTrainingData = DataHolder.DataHolder.InitializeNewDataHolder(
		isMonochrome ?
			HistogramHandler.MonochromeClass.GetAllHistograms()
		:	HistogramHandler.ColorfulClass.GetAllHistograms(),
		OptionsHandler.GetOptionNames(),
	);

	let formattedFinalData = DataHolder.DataHolder.InitializeNewDataHolder(
		isMonochrome ?
			HistogramHandler.MonochromeTestingClass.GetAllHistograms()
		:	HistogramHandler.ColorfulTestingClasss.GetAllHistograms(),
		OptionsHandler.GetOptionNames(),
	);
	//#endregion

	//#region Initialize starting information
	let numberOfInputNodes = formattedTrainingData.GetLengthsOfRawColorArray();
	let numberOfOutputNodes = formattedTrainingData.GetPossibleOptionsLength();
	let totalHiddenNodes =
		MLHandler.HiddenNodeRecommender.GetHiddenNodesBySimpleMethod(
			numberOfInputNodes,
			numberOfOutputNodes,
		);
	let hiddenNodesPerLayer =
		MLHandler.HiddenNodeRecommender.SetNumberOfHiddenNodesByLayer(
			totalHiddenNodes,
			amountOfHiddenLayers,
		);
	//#endregion

	//#region bot creation
	if (isDeleteBeforeTrain) {
		DeleteGroupIfExists(incomingGroupName);
	}

	let botGroup;
	if (MLGroupHandler.GroupMachineClass.IsGroupSaved(incomingGroupName)) {
		botgroup =
			MLGroupHandler.GroupMachineClass.LoadGroup(incomingGroupName);
	} else {
		botGroup = new MLGroupHandler.GroupMachineClass(
			amountOfBots,
			incomingGroupName,
		);
		botGroup.ConfigureModel(
			numberOfInputNodes,
			hiddenNodesPerLayer,
			numberOfOutputNodes,
			hiddenLayerActivationFunction,
			outputLayerActivationFunction,
		);
		botGroup.CompileMachines();
	}
	//#endregion

	//#region ways to train

	if (evaluationCacheAmount <= 0) {
		await botGroup.FitDataWithBatching(
			formattedTrainingData.GetRawColorDataAsTensor(),
			DataTranslator.BinaryTranslator.LabelsToIndexesTensor(
				formattedTrainingData.GetLabelsAsArray(),
				formattedTrainingData.GetOptionNames(),
			),
			formattedTrainingData.GetOptionNames(),
			totalEpochAmount,
			epochLogIteration,
			dataGroupAmount,
		);
	} else {
		await botGroup.RunThroughGeneticGenerations(
			formattedTrainingData,
			mutationChance,
			mutationVariation,
			isDeleteLowest,
			isApplyCrossover,
			evaluationCacheAmount,
		);
	}
	//#endregion

	//#region Prediction stuff
	//Finish when possible
	function predictOnFinalData(incomingGroup, formattedFinalData) {
		let rawTensorsAsArrayResult = incomingGroup.predictAll(
			formattedFinalData.GetRawColorDataAsTensor(),
		);

		let predictedLabelsMatrix = [];
		for (let i = 0; i < rawTensorsAsArrayResult.length; i++) {
			let labels = DataTranslator.BinaryTranslator.IndexesToLabels(
				rawTensorsAsArrayResult[i].arraySync(),
				OptionsHandler.GetOptionNames(),
			);
			predictedLabelsMatrix.push(labels);
		}

		let actualLabels = formattedFinalData.GetLabelsAsArray();

		incomingGroup.SortAll(predictedLabelsMatrix, actualLabels);
	}

	function PredictOnTrainingData(incomingGroup, formattedTrainingData) {
		let rawTensorsAsArrayResult = incomingGroup.predictAll(
			formattedTrainingData.GetRawColorDataAsTensor(),
		);

		let predictedLabelsMatrix = [];
		for (let i = 0; i < rawTensorsAsArrayResult.length; i++) {
			let labels = DataTranslator.BinaryTranslator.IndexesToLabels(
				rawTensorsAsArrayResult[i].arraySync(),
				OptionsHandler.GetOptionNames(),
			);
			predictedLabelsMatrix.push(labels);
		}

		let actualLabels = formattedTrainingData.GetLabelsAsArray();

		incomingGroup.SortAll(predictedLabelsMatrix, actualLabels);
	}

	if (isTestOnTrainingData) {
		PredictOnTrainingData(botGroup, formattedTrainingData);
	} else {
		predictOnFinalData(botGroup, formattedFinalData);
	}

	//#endregion

	//#region Print last known accuracies
	console.log('___FINAL_RESULTS_____');
	botGroup.PrintLastKnownAccuraciesAndInfo();
	console.log(botGroup.GetResultsStringFromLastTest());

	if (!isTestOnTrainingData) {
		console.log('EXPOSE');
		botGroup.LogLastResult();
	}
	//#endregion

	botGroup.SaveGroup();
}
