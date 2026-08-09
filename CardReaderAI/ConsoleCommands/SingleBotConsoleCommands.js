import * as FileHandler from "../FileRelated/fileHandler.js";
import * as HistogramHandler from "../FileRelated/histogramHandler.js";
import * as OptionsHandler from "../FileRelated/optionHandler.js";

import * as MLHandler from "../MachineLearningRelated/MLHandler.js";
import * as tf from "@tensorflow/tfjs";

import * as DataHolder from "../DataRelated/DataHolder.js";
import * as DataTranslator from "../DataRelated/DataTranslator.js";
import * as DataComparer from "../DataRelated/DataComparer.js";

import * as MathExtension from "../MathRelated/MathFunctions.js";

import * as MLGroupHandler from "../MachineLearningRelated/MLHandler.js";

import * as WeightRandomizer from "../MachineLearningRelated/WeightRandomizer.js";
import * as ActivationFunctions from "../MachineLearningRelated/ActivationFunctions.js";

import * as ModelLoaderHandler from "../FileRelated/ModelLoaderHandler.js";

export async function DeleteIfExists(botName = "default") {
	ModelLoaderHandler.DeleteBotIfExists(botName);
}

export async function TrainNewThenRun(
	botName = "default",
	isTestOnTrainingData = true,
	totalEpochAmount = 20,
	epochLogIteration = 10,
	dataGroupAmount = 5,
	amountOfHiddenLayers = 2,
	hiddenLayerActivationFunction = ActivationFunctions.GetRelu(),
	outputLayerActivationFunction = ActivationFunctions.GetSigmoid(),
	isMonochrome = false,
) {
	await DeleteIfExists(botName);
	await TrainThenRun(
		botName,
		isTestOnTrainingData,
		totalEpochAmount,
		epochLogIteration,
		dataGroupAmount,
		amountOfHiddenLayers,
		hiddenLayerActivationFunction,
		outputLayerActivationFunction,
		isMonochrome,
	);
}

//Make a function to run a single machine through a defined amount of iterations.
export async function TrainThenRun(
	botName = "default",
	isTestOnTrainingData = true,
	totalEpochAmount = 20,
	epochLogIteration = 10,
	dataGroupAmount = 5,
	amountOfHiddenLayers = 2,
	hiddenLayerActivationFunction = ActivationFunctions.GetRelu(),
	outputLayerActivationFunction = ActivationFunctions.GetSigmoid(),
	isMonochrome = true,
	isDeleteBeforeRun = false,
) {
	let trainingHistograms =
		isMonochrome === true
			? HistogramHandler.MonochromeClass.GetAllHistograms()
			: HistogramHandler.ColorfulClass.GetAllHistograms();

	let formattedTrainingData = DataHolder.DataHolder.InitializeNewDataHolder(
		trainingHistograms,
		OptionsHandler.GetOptionNames(),
	);

	let numberOfInputNodes = formattedTrainingData.GetLengthsOfRawColorArray();
	let numberOfOutputNodes = formattedTrainingData.GetPossibleOptionsLength();

	let totalHiddenNodes =
		MLHandler.HiddenNodeRecommender.GetHiddenNodesBySimpleMethod(
			numberOfInputNodes,
			numberOfOutputNodes,
		);
	let hiddenLayerAmmount = amountOfHiddenLayers;
	let hiddenNodesPerLayer =
		MLHandler.HiddenNodeRecommender.SetNumberOfHiddenNodesByLayer(
			totalHiddenNodes,
			hiddenLayerAmmount,
		);

	let newModel;

	if (isDeleteBeforeRun === true) {
		await DeleteIfExists(botName);
	}

	if (!MLHandler.IsModelSaved(botName)) {
		newModel = new MLHandler.ModelClass(botName);

		newModel.ConfigureModel(
			numberOfInputNodes,
			hiddenNodesPerLayer,
			numberOfOutputNodes,
			hiddenLayerActivationFunction,
			outputLayerActivationFunction,
		);

		newModel.CompileMachine("meanSquaredError", "sgd");
	} else {
		newModel = MLHandler.ModelClass.LoadModel(botName);
	}

	await newModel.FitDataWithBatching(
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
	newModel.GetSummary();

	let finalDataHistograms =
		isMonochrome === true
			? HistogramHandler.MonochromeTestingClass.GetAllHistograms()
			: HistogramHandler.ColorfulTestingClasss.GetAllHistograms();

	let formattedFinalData = DataHolder.DataHolder.InitializeNewDataHolder(
		finalDataHistograms,
		OptionsHandler.GetOptionNames(),
	);

	if (isTestOnTrainingData === true) {
		PredictOnTrainingData(newModel, formattedTrainingData);
	} else {
		PredictOnFinalData(newModel, formattedFinalData);
	}

	await newModel.SaveModel();

	function PredictOnFinalData(incomingModel, incomingFormattedFinalData) {
		let rawTensorResult = incomingModel.predict(
			incomingFormattedFinalData.GetRawColorDataAsTensor(),
		);

		rawTensorResult.print();
		incomingFormattedFinalData.GetLabelsAsTensor().print();

		let rawArrayResult = rawTensorResult.dataSync();

		let result = DataTranslator.BinaryTranslator.IndexesToLabels(
			rawTensorResult.arraySync(),
			incomingFormattedFinalData.GetOptionNames(),
		);

		DataComparer.CompareLabels(
			result,
			incomingFormattedFinalData.GetLabelsAsArray(),
		);
	}

	function PredictOnTrainingData(incomingModel, formattedTrainingData) {
		let rawTensorResult = incomingModel.predict(
			formattedTrainingData.GetRawColorDataAsTensor(),
		);
		rawTensorResult.print();
		formattedTrainingData.GetLabelsAsTensor().print();

		let rawArrayResult = rawTensorResult.dataSync();

		let result = DataTranslator.BinaryTranslator.IndexesToLabels(
			rawTensorResult.arraySync(),
			formattedTrainingData.GetOptionNames(),
		);

		DataComparer.CompareLabels(
			result,
			formattedTrainingData.GetLabelsAsArray(),
		);
	}
}
