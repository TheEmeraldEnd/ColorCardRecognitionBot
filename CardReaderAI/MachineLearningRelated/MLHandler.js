import * as tf from '@tensorflow/tfjs';
import * as DataComparer from '../DataRelated/DataComparer.js';
import * as LogHandler from '../FileRelated/LogHandler.js';
import * as ModelLoaderHandler from '../FileRelated/ModelLoaderHandler.js';
import { DataHolder as DataHolder } from '../DataRelated/DataHolder.js';
import * as MathFunctions from '../MathRelated/MathFunctions.js';
import * as WeightRandomizer from './WeightRandomizer.js';
import * as ActivationFunctionFunctions from './ActivationFunctions.js';

export class ModelClass {
	constructor(incomingName = '') {
		this.model = tf.sequential({ name: incomingName });
		this.activationFunctions = [];
		this.optimizer = '';
		this.lastRecordedAccuracy = 0.0;
	}

	InitializeSequentialModel(incomingName) {
		this.model = tf.sequential({ name: incomingName });
	}

	AddLayerAfterInputLayer(
		inputLayerNodes = 1,
		nextLayerNodes = 1,
		activationFunction = 'tanh',
	) {
		let nextLayer = tf.layers.dense({
			inputShape: inputLayerNodes,
			units: nextLayerNodes,
			activation: activationFunction,
		});

		this.model.add(nextLayer);

		this.activationFunctions.push(activationFunction);
	}

	AddLayer(nextLayerNodes = 1, activationFunction = '') {
		let nextLayer = null;

		if (activationFunction === '') {
			nextLayer = tf.layers.dense({ units: nextLayerNodes });
		} else {
			nextLayer = tf.layers.dense({
				units: nextLayerNodes,
				activation: activationFunction,
			});
		}

		this.model.add(nextLayer);
		this.activationFunctions.push(activationFunction);
	}

	ConfigureModel(
		inputLayerNodes = 1,
		hiddenLayerNodes = [],
		outputNodeAmounts = 1,
		hiddenLayerActivationFunction = 'tanh',
		outputLayerActivationFunction = 'sigmoid',
	) {
		if (hiddenLayerNodes.length === 0) {
			this.AddLayerAfterInputLayer(
				inputLayerNodes,
				outputNodeAmounts,
				outputLayerActivationFunction,
			);
		}

		if (hiddenLayerNodes.length === 1) {
			this.AddLayerAfterInputLayer(
				inputLayerNodes,
				hiddenLayerNodes[0],
				hiddenLayerActivationFunction,
			);
			this.AddLayer(outputNodeAmounts, outputLayerActivationFunction);
		}

		if (hiddenLayerNodes.length >= 2) {
			this.AddLayerAfterInputLayer(
				inputLayerNodes,
				hiddenLayerNodes[0],
				hiddenLayerActivationFunction,
			);

			for (let i = 1; i < hiddenLayerNodes.length; i++) {
				this.AddLayer(
					hiddenLayerNodes[i],
					hiddenLayerActivationFunction,
				);
			}

			this.AddLayer(outputNodeAmounts, outputLayerActivationFunction);
		}

		console.log(`Configuration for ${this.GetName()} complete`);
	}

	GetSummary() {
		console.log(`Name: ${this.GetName()}`);
		this.model.summary();
	}

	CompileMachine(
		lossFunction = 'meanSquaredError',
		icomingOptimizer = 'sgd',
	) {
		this.model.compile({ optimizer: icomingOptimizer, loss: lossFunction });

		this.optimizer = icomingOptimizer;

		console.log(`Compilation for ${this.GetName()} is complete`);
	}

	SetActivationFunction(incomingActivationFunction = '', layerIndex = 0) {
		if (incomingActivationFunction === '') {
			incomingActivationFunction = ActivationFunctionFunctions.GetRelu();
		}
		this.activationFunctions[layerIndex] = incomingActivationFunction;
		this.model.layers[layerIndex].activation = incomingActivationFunction;
	}

	//Utilizes the first hidden activation function for default if isHiddenSame is true
	RandomizeAllLayersActivations(
		maxMutationChance = 1,
		isFinalLimited = true,
		isHiddenSame = true,
	) {
		let defaultHiddenActivationFunction = this.activationFunctions[0];

		for (let i = 0; i < this.model.layers.length; i++) {
			this.RandomizeLayerActivation(i, maxMutationChance, isFinalLimited);
		}

		if (isHiddenSame == false || this.model.layers.length < 2) {
			return;
		}

		//Beyond makes sure that a random set is same for all hidden layers
		let alternativeHiddenActivation =
			ActivationFunctionFunctions.GetRandomActivationFunction(
				maxMutationChance,
				false,
				defaultHiddenActivationFunction,
			);

		for (let i = 0; i < this.model.layers.length - 1; i++) {
			this.SetActivationFunction(alternativeHiddenActivation, i);
		}
	}

	RandomizeLayerActivation(
		index = 0,
		maxRandomizationChance = 1,
		isFinalLimited = true,
	) {
		//Guard against index
		if (index < 0 || index >= this.model.layers.length) {
			console.log(
				`Please choose an index inside the layer bounds before randomizing activation.`,
			);
			return;
		}

		let incomingActivationFunction = '';

		if (index === this.model.layers.length - 1) {
			incomingActivationFunction =
				ActivationFunctionFunctions.GetRandomActivationFunction(
					maxRandomizationChance,
					isFinalLimited,
					this.activationFunctions[index],
				);
		} else {
			incomingActivationFunction =
				ActivationFunctionFunctions.GetRandomActivationFunction(
					maxRandomizationChance,
					false,
					this.activationFunctions[index],
				);
		}

		this.SetActivationFunction(incomingActivationFunction, index);
	}

	RandomizeWeights(
		maxWeightChangeVariation = 0.01,
		maxChanceWeightMutates = 0.01,
	) {
		let currentBotWeightArray = this.model.getWeights();
		let weights = WeightRandomizer.RandomizeWeights(
			currentBotWeightArray,
			maxWeightChangeVariation,
			maxChanceWeightMutates,
		);
		this.model.setWeights(weights);
	}

	async Fit(
		inputData,
		incomingOutputExpected,
		totalEpochAmount = 100,
		epochLogIteration = 10,
		batchSizeValue = 32,
	) {
		await this.model.fit(inputData, incomingOutputExpected, {
			epochs: totalEpochAmount,
			callbacks: {
				onEpochEnd: async (epoch, logs) => {
					if (epoch % epochLogIteration === 0) {
						console.log(`Epoch ${epoch}: error: ${logs.loss}`);
					}
				},
			},
			batchSize: batchSizeValue,
		});

		console.log(`Fitting for ${this.GetName()} is complete`);
	}

	GetName() {
		return this.model.name;
	}

	predict(incomingData) {
		let result = this.model.predict(incomingData);
		console.log(`Preidction for ${this.GetName()} is complete`);
		return result;
	}

	LogAccuracy(incomingPredictedLabels, actualLabels) {
		this.lastRecordedAccuracy = DataComparer.CopmareLabelsStringReturnFloat(
			incomingPredictedLabels,
			actualLabels,
		);
		console.log(this.lastRecordedAccuracy);
		return this.lastRecordedAccuracy;
	}

	LogPredict(
		incomingPredictedLabels,
		actualLabels,
		possibleOptions,
		predictionTensor,
	) {
		let resultContent = DataComparer.CompareLabelsReturnString(
			incomingPredictedLabels,
			actualLabels,
		);

		this.LogAccuracy(incomingPredictedLabels, actualLabels);

		resultContent += `\nRecorded ${new Date().toLocaleString()}`;

		resultContent += `\n\n\nPrediction tensor`;
		resultContent += `\n\n${predictionTensor.toString()}`;

		LogHandler.SaveAccuracyLog(this.GetName(), resultContent);
	}

	async SaveModel() {
		ModelSaver.SaveModel(this);
	}

	static LoadModel(incomingModelName = '') {
		return ModelLoader.LoadModel(incomingModelName);
	}

	async FitDataWithBatching(
		inputData,
		incomingOutputExpected,
		incomingPossibleOptions,
		totalEpochAmount = 100,
		epochLogIteration = 10,
		dataGroupAmount = 10,
	) {
		let numberOfGroups = incomingOutputExpected.shape[0] / dataGroupAmount;
		let remainder = Math.floor(
			incomingOutputExpected.shape[0] % dataGroupAmount,
		);
		let cutoffPoint = incomingOutputExpected.shape[0] - remainder;

		//Prepare the data by shaving remainder
		inputData.shape[0] -= remainder;
		incomingOutputExpected.shape[0] -= remainder;

		let splitInputData = tf.split(inputData, numberOfGroups);
		let splitIncomingOutputExpected = tf.split(
			incomingOutputExpected,
			numberOfGroups,
		);

		for (let i = 0; i < numberOfGroups; i++) {
			await this.Fit(
				splitInputData[i],
				splitIncomingOutputExpected[i],
				totalEpochAmount,
				epochLogIteration,
			);

			console.log(`epoch set ${i} of ${numberOfGroups}`);
		}
		console.log(`Data batching training completed`);
	}

	ToJSON() {
		let dataHolder = new ModelDataHolder();
		dataHolder.SetModelName(this.model);
		dataHolder.SetActivationFunctions(this.activationFunctions);
		dataHolder.SetWeightsAsArray(this.model);
		dataHolder.SetBiasAsArray(this.model);
		dataHolder.SetInputNodesAmount(this.model);
		dataHolder.SetOutputNodesAmount(this.model);
		dataHolder.SetLossFunction(this.model);
		dataHolder.SetOptimizerFunction(this.optimizer);

		return JSON.stringify(dataHolder);
	}

	static FromJSON(incomingJSON) {
		let dataHolder = new ModelDataHolder();
		dataHolder.JSONSetModelName(incomingJSON);
		dataHolder.JSONSetActivationFunctions(incomingJSON);
		dataHolder.JSONSetWeightsAsArray(incomingJSON);
		dataHolder.JSONSetBiasAsArray(incomingJSON);
		dataHolder.JSONSetInputNodesAmount(incomingJSON);
		dataHolder.JSONSetOutputNodesAmount(incomingJSON);
		dataHolder.JSONSetLossFunction(incomingJSON);
		dataHolder.JSONSetOptimizerFunction(incomingJSON);

		let hiddenLayersNodes = [];

		for (let i = 1; i < dataHolder.weights.length; i++) {
			let tempWeightsLength = dataHolder.weights[i].length;
			let tempBiasLength = dataHolder.biases[i].length;
			hiddenLayersNodes.push(tempWeightsLength / tempBiasLength);
		}

		let newModel = new ModelClass(dataHolder.name);

		newModel.ConfigureModel(
			dataHolder.inputNodesAmount,
			hiddenLayersNodes,
			dataHolder.outputNodesAmount,
			dataHolder.activationFunctions[0],
			dataHolder.activationFunctions[
				dataHolder.activationFunctions.length - 1
			],
		);

		//Add weights to the layers
		for (let i = 0; i < newModel.model.layers.length; i++) {
			//Weights Preparation

			//#region TODO: Make sure these dimentions match and doesn't have a remainder
			let tempWeightXDimention =
				Math.floor(dataHolder.weights[i].length) /
				dataHolder.biases[i].length;
			let tempWeightYDimention = dataHolder.biases[i].length;

			let tempWeights = MathFunctions.TurnArrayIntoMatrix(
				dataHolder.weights[i],
				tempWeightXDimention,
				tempWeightYDimention,
			);
			let tensorTempWeights = tf.tensor(tempWeights, [
				tempWeights.length,
				tempWeights[i].length,
			]);
			// //#endregion

			//Bias Preparation
			let testBiases = dataHolder.biases[i];
			let tensorTempBiases = tf.tensor(testBiases);

			//Set weights and biases into layer
			newModel.model.layers[i].weights[0].shape = [
				tempWeightXDimention,
				tempWeightYDimention,
			];
			newModel.model.layers[i].weights[1].shape = [tempWeightYDimention];

			newModel.model.layers[i].setWeights([
				tensorTempWeights,
				tensorTempBiases,
			]);
		}

		newModel.CompileMachine(
			dataHolder.lossFunction,
			dataHolder.optimizerFunction,
		);

		newModel.lastRecordedAccuracy = 0.0;

		console.log(`Loaded ${newModel.GetName()} Successfully`);
		return newModel;
	}

	CrossOverWithBot(incomingBot, mutationChance = 0.5) {
		//TODO: Need to figure out how to physically swap the weights
		for (let i = 0; i < this.model.layers.length; i++) {
			let tempArrayOfWeights = this.model.layers[i]
				.getWeights()[0]
				.dataSync();
		}
	}
}

class ModelDataHolder {
	constructor(
		name,
		activationFunctions,
		weights,
		biases,
		inputNodesAmount,
		outputNodesAmount,
		lossFunction,
		optimizerFunction,
	) {
		this.name = name;
		this.activationFunctions = activationFunctions;
		this.weights = weights;
		this.biases = biases;
		this.inputNodesAmount = inputNodesAmount;
		this.outputNodesAmount = outputNodesAmount;
		this.lossFunction = lossFunction;
		this.optimizerFunction = optimizerFunction;
	}

	//#region Setting Methods
	SetModelName(incomingModel) {
		this.name = incomingModel.name;
	}

	SetActivationFunctions(activationFunctions = []) {
		this.activationFunctions = activationFunctions;
	}

	SetWeightsAsArray(incomingModel) {
		let result = [];
		let layersAmount = incomingModel.layers.length;
		for (let i = 0; i < layersAmount; i++) {
			result.push(incomingModel.layers[i].getWeights()[0].dataSync());
		}
		this.weights = result;
	}

	SetBiasAsArray(incomingModel) {
		let result = [];
		let layersAmount = incomingModel.layers.length;
		for (let i = 0; i < layersAmount; i++) {
			result.push(incomingModel.layers[i].getWeights()[1].dataSync());
		}
		this.biases = result;
	}

	SetInputNodesAmount(incomingModel) {
		let inpuytLayerWeightsLength = incomingModel.layers[0]
			.getWeights()[0]
			.dataSync().length;
		let inputLayerBiasLength = incomingModel.layers[0]
			.getWeights()[1]
			.dataSync().length;
		let result = inpuytLayerWeightsLength / inputLayerBiasLength;
		this.inputNodesAmount = result;
	}

	SetOutputNodesAmount(incomingModel) {
		let lengthOfLayers = incomingModel.layers.length;
		let result = incomingModel.layers[lengthOfLayers - 1]
			.getWeights()[1]
			.dataSync().length;
		this.outputNodesAmount = result;
	}

	SetLossFunction(incomingModel) {
		this.lossFunction = incomingModel.loss;
	}

	SetOptimizerFunction(incomingOptimizer) {
		this.optimizerFunction = incomingOptimizer;
	}
	//#endregion

	//#region Setting JSON Methods
	JSONSetModelName(incomingJSON) {
		let result = JSON.parse(incomingJSON).name;
		this.name = result;
	}

	JSONSetActivationFunctions(incomingJSON) {
		let result = JSON.parse(incomingJSON).activationFunctions;
		this.activationFunctions = result;
	}

	JSONSetWeightsAsArray(incomingJSON) {
		let result = [];
		let data = JSON.parse(incomingJSON).weights;
		for (let i = 0; i < data.length; i++) {
			result.push(Object.values(data[i]));
		}
		this.weights = result;
	}

	JSONSetBiasAsArray(incomingJSON) {
		let result = [];
		let data = JSON.parse(incomingJSON).biases;
		for (let i = 0; i < data.length; i++) {
			result.push(Object.values(data[i]));
		}
		this.biases = result;
	}

	JSONSetInputNodesAmount(incomingJSON) {
		let result = JSON.parse(incomingJSON).inputNodesAmount;
		this.inputNodesAmount = result;
	}

	JSONSetOutputNodesAmount(incomingJSON) {
		let result = JSON.parse(incomingJSON).outputNodesAmount;
		this.outputNodesAmount = result;
	}

	JSONSetLossFunction(incomingJSON) {
		let result = JSON.parse(incomingJSON).lossFunction;
		this.lossFunction = result;
	}

	JSONSetOptimizerFunction(incomingJSON) {
		let result = JSON.parse(incomingJSON).optimizerFunction;
		this.optimizerFunction = result;
	}
	//#endregion
}

class ModelSaver {
	//The reason for repeditive names is to make future optimization for not requiring variables easier to replace
	static SaveModel(incomingModelClass) {
		let jsonDataHolder = incomingModelClass.ToJSON();

		ModelLoaderHandler.SaveModel(
			incomingModelClass.GetName(),
			JSON.stringify(modelDataHolder),
		);
	}
}

class ModelLoader {
	//The reason for repeditive names is to make future optimization for not requiring variables easier to replace
	static LoadModel(incomingModelName = '') {
		//Guard against no model existing
		if (!IsModelSaved(incomingModelName)) {
			console.log(
				`Couldn't recieve model. Loading empty model with name ${incomingModelName}`,
			);
			return new ModelClass(incomingModelName);
		}

		let dataJSON = ModelLoaderHandler.GetModelData(incomingModelName);

		let newModel = ModelClass.FromJSON(dataJSON);

		return newModel;
	}
}

export function IsModelSaved(incomingName) {
	return ModelLoaderHandler.IsBotSaved(incomingName);
}

export class HiddenNodeRecommender {
	static GetHiddenNodesBySimpleMethod(
		numberOfInputNodes = 1.0,
		numberOfOutputNodes = 1.0,
	) {
		return Math.floor((numberOfInputNodes ** numberOfOutputNodes) ** 0.5);
	}

	static GetHiddenNodesByNonSimpleAmount(
		numberOfInputNodes = 1,
		numberOfOutputNodes = 1,
		numberOfSamples = 1,
		arbitraryAlpha = 2,
	) {
		let numerator = numberOfSamples;
		let denominator =
			arbitraryAlpha * (numberOfInputNodes + numberOfOutputNodes);

		let result = numerator / denominator;
		return Math.floor(result);
	}

	static SetNumberOfHiddenNodesByLayer(
		totalNumberOfHiddenNodes = 1,
		desiredNumberOfLayers = 1,
	) {
		let hiddenNodesByLayer = [];
		let remainingHiddenNodes = Math.floor(totalNumberOfHiddenNodes);

		if (desiredNumberOfLayers === 0) {
			return [];
		}

		if (desiredNumberOfLayers === 1) {
			return [totalNumberOfHiddenNodes];
		}

		for (let i = 0; i < desiredNumberOfLayers; i++) {
			let layerNodeAmount = Math.floor(
				remainingHiddenNodes / desiredNumberOfLayers,
			);
			remainingHiddenNodes -= layerNodeAmount;
			hiddenNodesByLayer.push(remainingHiddenNodes);
		}

		return hiddenNodesByLayer;
	}
}
