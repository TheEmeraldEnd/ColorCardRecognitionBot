import * as MLHandler from '../MachineLearningRelated/MLHandler.js'
import * as DataComparer from "../DataRelated/DataComparer.js";

export class GroupMachineClass{


    constructor(amountOfBots = 1, groupName = ""){
        //Guard against non-positive intagers
        if (amountOfBots <= 0){
            amountOfBots = 1;
        }

        this.bots = [];
        this.groupName = groupName;

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

    PredictAllAndSort(incomingDataRawColorData, incomingOptionNames, dataTranslatorClass, actualLabels){
        let collectionOfResultTensors = this.predictAll(incomingDataRawColorData);
        collectionOfResultTensors[0].print();

        // let rawArrayResult = rawTensorResult.dataSync();
        let accuracies = [];

        for(let i = 0; i < collectionOfResultTensors.length; i++){
            let tempResultTensor = collectionOfResultTensors[i];
            let tempPredictionLabels = dataTranslatorClass.IndexesToLabels(tempResultTensor.arraySync(), incomingDataRawColorData )
            console.log(tempPredictionLabels)
            let comparer = DataComparer.CompareLabels(tempPredictionLabels, actualLables);

            console.log(comparer)
            let accuracyResult = 0.0;
        }
        // let result = DataTranslator.BinaryTranslator.IndexesToLabels(rawTensorResult.arraySync(), incomingOptionNames);

        // DataComparer.CompareLabels(result, formattedTrainingData.GetLabelsAsArray());
    }

    

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