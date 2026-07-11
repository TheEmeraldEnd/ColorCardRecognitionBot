import * as MLHandler from '../MachineLearningRelated/MLHandler.js'
import * as DataComparer from "../DataRelated/DataComparer.js";
import * as WeightRandomizer from './WeightRandomizer.js';
import * as MathExtension from '../MathRelated/MathFunctions.js'

export class GroupMachineClass{


    constructor(amountOfBots = 1, groupName = ""){
        //Guard against non-positive intagers
        if (amountOfBots <= 0){
            amountOfBots = 1;
        }

        this.bots = [];
        this.groupName = groupName;
        this.amountOfBots = amountOfBots;

        for(let i = 0; i < amountOfBots; i++){
            this.AddNewBot(this.groupName)
        }
    }

    InitializeSequentialModel(incomingName){
        for(let i = 0; i < this.bots.length; i++){
            this.bots[i].InitializeSequentialModel(incomingName);
        }
        
    }

    AddLayerAfterInputLayer(inputLayerNodes = 1, nextLayerNodes = 1, activationFunction = 'tanh'){
        this.bots.map(b => b.AddLayerAfterInputLayer(inputLayerNodes, nextLayerNodes, activationFunction))
    }

    AddLayer(nextLayerNodes = 1, activationFunction = ''){
        this.bots.map(b => b.AddLayer(nextLayerNodes, activationFunction))
    }

    ConfigureModel(
        inputLayerNodes = 1, 
        hiddenLayerNodes = [], 
        outputNodeAmounts = 1, 
        hiddenLayerActivationFunction = 'tanh',
        outputLayerActivationFunction = 'sigmoid'){

        this.bots.map(b => b.ConfigureModel(
            inputLayerNodes, 
            hiddenLayerNodes, 
            outputNodeAmounts, 
            hiddenLayerActivationFunction,
            outputLayerActivationFunction
        ))
    }

    GetSummary(){
        this.bots.forEach(b => b.GetSummary());
    }

    CompileMachines(lossFunction = 'meanSquaredError', icomingOptimizer = 'sgd'){
        this.bots.map(b => b.CompileMachine(lossFunction, icomingOptimizer ))
    }

    async Fit(inputData, incomingOutputExpected, totalEpochAmount = 100, epochLogIteration = 10, batchSizeValue = 32){
        for(let i = 0; i < this.bots.length; i++){
            await this.bots.Fit(
                inputData, incomingOutputExpected, totalEpochAmount, epochLogIteration, batchSizeValue
            )
        }
    }

    predictAll(incomingRawColorData){
        let predictionResults = []
        for(let i = 0; i < this.bots.length; i++){
            let predictionString = this.bots[i].predict(incomingRawColorData);
            predictionResults.push(predictionString);
        }

        return predictionResults;
    }

    RandomizeWeightsForOneModel(maxWeightChangeVariation = 0.01, maxChanceWeightMutates = 0.01, index = 0){
        let currentBotWeightArray = this.bots[index].model.getWeights()
        let weights = WeightRandomizer.RandomizeWeights(currentBotWeightArray, maxWeightChangeVariation, maxChanceWeightMutates)
        this.bots[index].model.setWeights(weights)
    }

    RandomizeWeightsAndBiasesAll(maxWeightChangeVariation = 0.01, maxChanceWeightMutates = 0.01){
        for(let i = 0; i < this.bots.length; i++){
            this.RandomizeWeightsForOneModel(maxWeightChangeVariation, maxChanceWeightMutates, i);
        }
    }

    //Assumed highest is at front of list
    DeleteHalfHIghest(){
        //Guard rails
        if ([0, 1].includes(this.bots.length)){
            return;
        }

        let lengthOfDeletion = Math.floor(this.bots.length/2.0)

        this.bots.splice(0, lengthOfDeletion)
    }

    //Assumes lowest are at the back
    DeleteHalfLowest(){
        //Guard rails
        if ([0, 1].includes(this.bots.length)){
            return;
        }

        let lengthOfDeletion = Math.floor(this.bots.length/2.0)

        this.bots.splice(this.bots.length - lengthOfDeletion, lengthOfDeletion)
    }

    DeleteHalfRandom(){
        //Guard rails
        if ([0, 1].includes(this.bots.length)){
            return;
        }

        let lengthOfDeletion = Math.floor(this.bots.length/2.0)

        for(let i = 0; i < lengthOfDeletion; i++){
            this.bots.splice( MathExtension.GetRandomInt(0, this.bots.length), 1)
        }

        console.log(this.bots.length)
    }

    //Still under construction
    // PredictAllAndSort(incomingDataRawColorData, incomingOptionNames, dataTranslatorClass, actualLabels){
    //     let collectionOfResultTensors = this.predictAll(incomingDataRawColorData);
    //     collectionOfResultTensors[0].print();

    //     // let rawArrayResult = rawTensorResult.dataSync();
    //     let accuracies = [];

    //     for(let i = 0; i < collectionOfResultTensors.length; i++){
    //         let tempResultTensor = collectionOfResultTensors[i];
    //         let tempPredictionLabels = dataTranslatorClass.IndexesToLabels(tempResultTensor.arraySync(), incomingDataRawColorData )
    //         console.log(tempPredictionLabels)
    //         let comparer = DataComparer.CompareLabels(tempPredictionLabels, actualLables);

    //         console.log(comparer)
    //         let accuracyResult = 0.0;
    //     }
    //     // let result = DataTranslator.BinaryTranslator.IndexesToLabels(rawTensorResult.arraySync(), incomingOptionNames);

    //     // DataComparer.CompareLabels(result, formattedTrainingData.GetLabelsAsArray());
    // }

    

    GetName(){
        return this.groupName;
    }

    async SaveModel(){

    }


    static LoadModel(incomingModelName = ""){
         
    }   

    async FitDataWithBatching(inputData, incomingOutputExpected, incomingPossibleOptions, totalEpochAmount = 100, epochLogIteration = 10, dataGroupAmount = 10){
        console.log(`Please wait until the data is done batching for ${this.groupName}`)

        //Possibly remove await and put it later for better performance with multithreading
        for(let i = 0; i < this.bots.length; i++){
            await this.bots[i].FitDataWithBatching(inputData, incomingOutputExpected, incomingPossibleOptions, totalEpochAmount, epochLogIteration, dataGroupAmount);
        }

        await Promise.resolve
        console.log(`Data batching for group ${this.groupName}`)
    }

    AddNewBot(incomingName = ""){
        let tempMachineLearner = new MLHandler.ModelClass(incomingName);
        this.bots.push(tempMachineLearner);
    }
}