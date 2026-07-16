import * as MLHandler from '../MachineLearningRelated/MLHandler.js';
import * as DataComparer from '../DataRelated/DataComparer.js';
import * as WeightRandomizer from './WeightRandomizer.js';
import * as MathExtension from '../MathRelated/MathFunctions.js';
import * as ActivationFunctions from './ActivationFunctions.js';
import { clone } from '@tensorflow/tfjs';

//Note that highest value accuracy bots should be at the right of array while lowest are beginning
export class GroupMachineClass {
	constructor(amountOfBots = 1, groupName = '') {
		//Guard against non-positive intagers
		if (amountOfBots <= 0) {
			amountOfBots = 1;
		}

		this.bots = [];
		this.groupName = groupName;
		this.amountOfBots = amountOfBots;

		for (let i = 0; i < amountOfBots; i++) {
			this.AddNewBot(this.groupName);
		}
	}

	InitializeSequentialModel(incomingName) {
		for (let i = 0; i < this.bots.length; i++) {
			this.bots[i].InitializeSequentialModel(incomingName);
		}
	}

	AddLayerAfterInputLayer(
		inputLayerNodes = 1,
		nextLayerNodes = 1,
		activationFunction = 'tanh',
	) {
		this.bots.map((b) =>
			b.AddLayerAfterInputLayer(
				inputLayerNodes,
				nextLayerNodes,
				activationFunction,
			),
		);
	}

	AddLayer(nextLayerNodes = 1, activationFunction = '') {
		this.bots.map((b) => b.AddLayer(nextLayerNodes, activationFunction));
	}

	ConfigureModel(
		inputLayerNodes = 1,
		hiddenLayerNodes = [],
		outputNodeAmounts = 1,
		hiddenLayerActivationFunction = 'tanh',
		outputLayerActivationFunction = 'sigmoid',
	) {
		this.bots.map((b) =>
			b.ConfigureModel(
				inputLayerNodes,
				hiddenLayerNodes,
				outputNodeAmounts,
				hiddenLayerActivationFunction,
				outputLayerActivationFunction,
			),
		);
	}

	GetSummary() {
		this.bots.forEach((b) => b.GetSummary());
	}

	CompileMachines(
		lossFunction = 'meanSquaredError',
		icomingOptimizer = 'sgd',
	) {
		this.bots.map((b) => b.CompileMachine(lossFunction, icomingOptimizer));
	}

	async Fit(
		inputData,
		incomingOutputExpected,
		totalEpochAmount = 100,
		epochLogIteration = 10,
		batchSizeValue = 32,
	) {
		for (let i = 0; i < this.bots.length; i++) {
			await this.bots.Fit(
				inputData,
				incomingOutputExpected,
				totalEpochAmount,
				epochLogIteration,
				batchSizeValue,
			);
		}
	}

	predictAll(incomingRawColorData) {
		let predictionResults = [];
		for (let i = 0; i < this.bots.length; i++) {
			let predictionString = this.bots[i].predict(incomingRawColorData);
			predictionResults.push(predictionString);
		}

		return predictionResults;
	}

	RandomizeWeightsForOneModel(
		maxWeightChangeVariation = 0.01,
		maxChanceWeightMutates = 0.01,
		index = 0,
	) {
		let currentBotWeightArray = this.bots[index].model.getWeights();
		let weights = WeightRandomizer.RandomizeWeights(
			currentBotWeightArray,
			maxWeightChangeVariation,
			maxChanceWeightMutates,
		);
		this.bots[index].model.setWeights(weights);

		this.bots[index].RandomizeWeights(
			maxWeightChangeVariation,
			maxChanceWeightMutates,
		);
	}

	RandomizeWeightsAndBiasesAll(
		maxWeightChangeVariation = 0.01,
		mutationChance = 0.01,
	) {
		for (let i = 0; i < this.bots.length; i++) {
			this.RandomizeWeightsForOneModel(
				maxWeightChangeVariation,
				mutationChance,
				i,
			);
		}
	}

	//Bots may need recompilation afterwards
	RandomizeActivationsAll(
		mutationChance = 1,
		isFinalLimited = true,
		isHiddenSame = true,
	) {
		for (let i = 0; i < this.bots.length; i++) {
			this.RandomizeActivations(
				i,
				mutationChance,
				isFinalLimited,
				isHiddenSame,
			);
		}
	}

	RandomizeActivations(
		botIndex = 0,
		maxRandomizationChance = 1,
		isFinalLimited = true,
		isHiddenSame = true,
	) {
		//Guard against bot index bounds
		if (botIndex < 0 || botIndex > this.bots.length) {
			console.log('Please enter in a valid bot index');
		}

		this.bots[botIndex].RandomizeAllLayersActivations(
			maxRandomizationChance,
			isFinalLimited,
			isHiddenSame,
		);
	}

	//Assumed highest is at end of array
	DeleteHalfLowest() {
		//Guard rails
		if ([0, 1].includes(this.bots.length)) {
			return;
		}

		let lengthOfDeletion = Math.floor(this.bots.length / 2.0);

		this.bots.splice(0, lengthOfDeletion);
	}

	//Assumes lowest are at beginnning
	DeleteHalfHighest() {
		//Guard rails
		if ([0, 1].includes(this.bots.length)) {
			return;
		}

		let lengthOfDeletion = Math.floor(this.bots.length / 2.0);

		this.bots.splice(this.bots.length - lengthOfDeletion, lengthOfDeletion);
	}

	DeleteHalfRandom() {
		//Guard rails
		if ([0, 1].includes(this.bots.length)) {
			return;
		}

		let lengthOfDeletion = Math.floor(this.bots.length / 2.0);

		for (let i = 0; i < lengthOfDeletion; i++) {
			this.bots.splice(
				MathExtension.GetRandomInt(0, this.bots.length),
				1,
			);
		}

		console.log(this.bots.length);
	}

	CrossoverToFill() {}

	//Needs work: Check weights on bots
	CrossoverCloneOneBot(bot1, bot2) {
		bot1.GetSummary();
		bot2.GetSummary();
		let bot1JSON = bot1.ToJSON();
		console.log(bot1JSON);

		let bot2JSON = bot2.ToJSON();
		console.log(bot2JSON);

		let newCloneJSON = bot1.ToJSON();
		console.log(newCloneJSON === bot1JSON);

		console.log(newCloneJSON === bot1JSON);
	}

	//Cloning with a little bit of mutation
	MutateToFill(
		maxWeightChangeVariation = 0.01,
		maxChanceWeightMutates = 0.01,
	) {
		let limitToFill = this.amountOfBots;
		let botLength = this.bots.length;
		let lowerLimit = 0;

		while (botLength > limitToFill && isDeleteRandomIfOver === true) {
			this.DeleteHalfRandom();
		}

		if (botLength <= lowerLimit) {
			//Push a bot in to make a thing of 1, then fill
			this.bots.push(new MLHandler.ModelClass(this.GetName()));
		}

		this.CloneRandomToFill();
		this.RandomizeWeightsAndBiasesAll(
			maxWeightChangeVariation,
			maxChanceWeightMutates,
		);
	}

	//TODO: Need to test if higher works. Assumed true for now
	CloneRandomToFill(
		isDeleteRandomIfOver = false,
		isCloneHighestOnly = false,
	) {
		let limitToFill = this.amountOfBots;
		let botLength = this.bots.length;
		let lowerLimit = 0;

		while (botLength > limitToFill && isDeleteRandomIfOver === true) {
			this.DeleteHalfRandom();
		}

		if (botLength <= lowerLimit) {
			//Push a bot in to make a thing of 1, then fill
			this.bots.push(new MLHandler.ModelClass(this.GetName()));
		}

		//Figure out which clones to clone
		let difference = limitToFill - botLength;
		let botsToClone = [];
		for (let i = 0; i < difference; i++) {
			let indexToClone = 0;

			if (isCloneHighestOnly === false) {
				indexToClone = MathExtension.GetRandomInt(0, this.bots.length);
			} else {
				let tempHalfLength = Math.ceil(this.bots.length / 2.0);
				indexToClone = MathExtension.GetRandomInt(
					tempHalfLength,
					this.bots.length,
				);
			}

			botsToClone.push();
		}

		//Generate the clones
		for (let i = 0; i < botsToClone.length; i++) {
			let clonedBot = this.CloneBot(botsToClone[i]);
			this.bots.splice(0, 0, clonedBot);
		}
	}

	CloneBot(cloneIndex = 0) {
		//Create clone bot
		let cloneBot = MLHandler.ModelClass.FromJSON(
			this.bots[cloneIndex].ToJSON(),
		);
		return cloneBot;
	}

	PredictAll(incomingData) {
		let results = [];

		for (let i = 0; i < this.bots.length; i++) {
			results.push(this.bots[i].predict(incomingData));
		}

		return results;
	}

	GetGroupAverageAccuracy() {
		let result = 0.0;
		let count = this.bots.length;
		for (let i = 0; i < count; i++) {
			result += this.bots[i].lastRecordedAccuracy;
		}
		console.log(
			`Average group accuracy for ${this.GetName()}: ${(result / count) * 100.0}%`,
		);
		return result / count;
	}

	LogAccuracies(incomingPredictedLabelsArray = [], actualLabels) {
		if (this.bots.length != incomingPredictedLabelsArray.length) {
			console.log(`Lengths do not match to log accuracies.`);
			return;
		}
		let tempAccuracies = [];
		for (let i = 0; i < incomingPredictedLabelsArray.length; i++) {
			tempAccuracies.push(
				this.bots[i].LogAccuracy(
					incomingPredictedLabelsArray[i],
					actualLabels,
				),
			);
		}
		return tempAccuracies;
	}

	//Sorted by lowest at left and highest at right
	PredictAllAndSort(incomingPredictedLabelsArray = [], actualLabels) {
		this.LogAccuracies(incomingPredictedLabelsArray, actualLabels);
		this.bots.sort(function (object1, object2) {
			if (object1.lastRecordedAccuracy > object2.lastRecordedAccuracy)
				return 1;
			else if (
				object1.lastRecordedAccuracy < object2.lastRecordedAccuracy
			)
				return -1;
			else return 0;
		});
		console.log(`Accuracies recorded and bots sorted on ${this.GetName()}`);
	}

	GetName() {
		return this.groupName;
	}

	async SaveModel() {}

	static LoadModel(incomingModelName = '') {}

	async FitDataWithBatching(
		inputData,
		incomingOutputExpected,
		incomingPossibleOptions,
		totalEpochAmount = 100,
		epochLogIteration = 10,
		dataGroupAmount = 10,
	) {
		console.log(
			`Please wait until the data is done batching for ${this.groupName}`,
		);

		//Possibly remove await and put it later for better performance with multithreading
		for (let i = 0; i < this.bots.length; i++) {
			await this.bots[i].FitDataWithBatching(
				inputData,
				incomingOutputExpected,
				incomingPossibleOptions,
				totalEpochAmount,
				epochLogIteration,
				dataGroupAmount,
			);
		}

		await Promise.resolve;
		console.log(`Data batching for group ${this.groupName}`);
	}

	AddNewBot(incomingName = '') {
		let tempMachineLearner = new MLHandler.ModelClass(incomingName);
		this.bots.push(tempMachineLearner);
	}
}
