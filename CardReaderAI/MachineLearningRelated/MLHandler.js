import * as tf from '@tensorflow/tfjs';
import * as DataComparer from "../DataRelated/DataComparer.js";
import * as LogHandler from "../FileRelated/LogHandler.js";
import * as ModelLoaderHandler from "../FileRelated/ModelLoaderHandler.js";
import { DataHolder as DataHolder } from '../DataRelated/DataHolder.js';

export class ModelClass{

    constructor(incomingName = ""){
        this.model = tf.sequential({name: incomingName});
        this.activationFunctions = [];
        this.optimizer = "";
    }

    InitializeSequentialModel(incomingName){
        this.model = tf.sequential({name:incomingName});
        
    }

    AddLayerAfterInputLayer(inputLayerNodes = 1, nextLayerNodes = 1, activationFunction = 'tanh'){
        let nextLayer = tf.layers.dense({
            inputShape: inputLayerNodes,
            units: nextLayerNodes,
            activation: activationFunction,
        });
        
        this.model.add(
            nextLayer
        );

        this.activationFunctions.push(activationFunction);
    }

    AddLayer(nextLayerNodes = 1, activationFunction = ''){
        let nextLayer = null;

        if (activationFunction === ''){
            nextLayer = 
                tf.layers.dense({
                    units:nextLayerNodes
                });
        }
        else{
            nextLayer = 
                tf.layers.dense({
                    units: nextLayerNodes,
                    activation: activationFunction
                })
        }

        this.model.add(nextLayer);
        this.activationFunctions.push(activationFunction);
    }

    ConfigureModel(
        inputLayerNodes = 1, 
        hiddenLayerNodes = [], 
        outputNodeAmounts = 1, 
        hiddenLayerActivationFunction = 'tanh',
        outputLayerActivationFunction = 'sigmoid'){
        
        if (hiddenLayerNodes.length === 0){
            this.AddLayerAfterInputLayer(inputLayerNodes, outputNodeAmounts, outputLayerActivationFunction);
        }

        if (hiddenLayerNodes.length === 1){
            this.AddLayerAfterInputLayer(inputLayerNodes, hiddenLayerNodes[0], hiddenLayerActivationFunction);
            this.AddLayer(outputNodeAmounts, outputLayerActivationFunction);
        }

        if (hiddenLayerNodes.length >= 2){
            this.AddLayerAfterInputLayer(inputLayerNodes, hiddenLayerNodes[0], hiddenLayerActivationFunction);
           
            for(let i = 1; i < hiddenLayerNodes.length; i++){
                this.AddLayer(hiddenLayerNodes[i], hiddenLayerActivationFunction);
            }

            this.AddLayer(outputNodeAmounts, outputLayerActivationFunction);
        }

        console.log(`Configuration for ${this.GetName()} complete`);
    }

    GetSummary(){
        console.log(`Name: ${this.GetName()}`);
        this.model.summary();
    }

    CompileMachine(lossFunction = 'meanSquaredError', icomingOptimizer = 'sgd'){
        this.model.compile({
            optimizer: icomingOptimizer,
            loss: lossFunction
        });

        this.optimizer = icomingOptimizer;

        console.log(`Compilation for ${this.GetName()} is complete`)
    }

    async Fit(inputData, incomingOutputExpected, totalEpochAmount = 100, epochLogIteration = 10, batchSizeValue = 32){
        await this.model.fit(
            inputData, 
            incomingOutputExpected,
            {
                epochs : totalEpochAmount,
                callbacks: {
                    onEpochEnd: async (epoch, logs) => {
                        if (epoch % epochLogIteration === 0){
                            console.log(`Epoch ${epoch}: error: ${logs.loss}`)
                        }
                    }
                },
                batchSize : batchSizeValue
            }
        )

        console.log(`Fitting for ${this.GetName()} is complete`);
    }

    predict(incomingData){
        let result = this.model.predict(incomingData);
        console.log(`Preidction for ${this.GetName()} is complete`)
        return result;
    }

    GetName(){
        return this.model.name;
    }

    LogPredict(incomingPredictedLabels, actualLabels, possibleOptions, predictionTensor ){
        let resultContent = DataComparer.CompareLabelsReturnString(incomingPredictedLabels, actualLabels);

        resultContent += `\nRecorded ${new Date().toLocaleString()}`

        resultContent += `\n\n\nPrediction tensor`;
        resultContent += `\n\n${predictionTensor.toString()}`;

        LogHandler.SaveAccuracyLog(this.GetName(), resultContent);
    }

    async SaveModel(){

        
        ModelSaver.SaveModel(this.model, this.activationFunctions, this.optimizer);
    }


    // static LoadModel(incomingModelName = ""){
    //     ModelLoader.LoadModel(incomingModelName);
        
    // }   

    async FitDataWithBatching(inputData, incomingOutputExpected, incomingPossibleOptions, totalEpochAmount = 100, epochLogIteration = 10, dataGroupAmount = 10){
        let numberOfGroups = incomingOutputExpected.shape[0] / dataGroupAmount;
        let remainder = Math.floor(incomingOutputExpected.shape[0] % dataGroupAmount);
        let cutoffPoint = incomingOutputExpected.shape[0] - remainder;

        //Prepare the data by shaving remainder
        inputData.shape[0] -= remainder;        
        incomingOutputExpected.shape[0] -= remainder;

        let splitInputData = tf.split(inputData, numberOfGroups );
        let splitIncomingOutputExpected = tf.split(incomingOutputExpected, numberOfGroups);
        

        for(let i = 0; i < numberOfGroups; i++){
            await this.Fit(
                splitInputData[i],
                splitIncomingOutputExpected[i],
                totalEpochAmount,
                epochLogIteration);

            console.log(`epoch set ${i} of ${numberOfGroups}`)
        }
        console.log(`Data batching training completed`)
    }
}

class ModelDataHolder{
    constructor(name, activationFunctions, weights, biases, inputNodesAmount, outputNodesAmount, lossFunction, optimizerFunction){
        this.name = name;
        this.activationFunctions = activationFunctions;
        this.weights = weights;
        this.biases = biases;
        this.inputNodesAmount = inputNodesAmount;
        this.outputNodesAmount = outputNodesAmount;
        this.lossFunction = lossFunction;
        this.optimizerFunction = optimizerFunction;
    }

}

class ModelSaver{
    

    //The reason for repeditive names is to make future optimization for not requiring variables easier to replace
    static SaveModel(incomingModel, activationFunctions = [], incomingOptimizer = ""){
        const modelDataHolder = new ModelDataHolder(
            this.#GetModelName(incomingModel),
            this.#GetActivationFunctions(activationFunctions),
            this.#GetWeightsAsArray(incomingModel),
            this.#GetBiasAsArray(incomingModel),
            this.#GetInputNodesAmount(incomingModel),
            this.#GetOutputNodesAmount(incomingModel),
            this.#GetLossFunction(incomingModel),
            this.#GetOptimizerFunction(incomingOptimizer)
        )

        ModelLoaderHandler.SaveModel(this.#GetModelName(incomingModel), JSON.stringify(modelDataHolder))
    }

    static #GetModelName(incomingModel){
        return incomingModel.name
    }

    static #GetActivationFunctions(activationFunctions = []){
        return activationFunctions
    }

    static #GetWeightsAsArray(incomingModel){
        let result = []
        let layersAmount = incomingModel.layers.length;
        for (let i = 0; i < layersAmount; i++) {
            result.push(incomingModel.layers[i].getWeights()[0].dataSync());;
        }
        return result;
    }

    static #GetBiasAsArray(incomingModel){
        let result = []
        let layersAmount = incomingModel.layers.length;
        for (let i = 0; i < layersAmount; i++) {
            result.push(incomingModel.layers[i].getWeights()[1].dataSync());
        }
        return result;
    }

    static #GetInputNodesAmount(incomingModel){
        let inpuytLayerWeightsLength = incomingModel.layers[0].getWeights()[0].dataSync().length;
        let inputLayerBiasLength = incomingModel.layers[0].getWeights()[1].dataSync().length;
        let result = inpuytLayerWeightsLength / inputLayerBiasLength;
        return result;
    }

    static #GetOutputNodesAmount(incomingModel){
        let lengthOfLayers = incomingModel.layers.length;
        let result = incomingModel.layers[lengthOfLayers - 1].getWeights()[1].dataSync().length;
        return result
    }

    static #GetLossFunction(incomingModel){
        return incomingModel.loss;
    }

    static #GetOptimizerFunction(incomingOptimizer){
        return incomingOptimizer;
    }
}

class ModelLoader{
    

    //The reason for repeditive names is to make future optimization for not requiring variables easier to replace
    static LoadModel(incomingModelName = ""){

        let dataJSON = ModelLoaderHandler.GetModelData(incomingModelName);

        const dataHolder = new ModelDataHolder(
            this.#GetModelName(dataJSON),
            this.#GetActivationFunctions(dataJSON),
            this.#GetWeightsAsArray(dataJSON),
            this.#GetBiasAsArray(dataJSON),
            this.#GetInputNodesAmount(dataJSON),
            this.#GetOutputNodesAmount(dataJSON),
            this.#GetLossFunction(dataJSON),
            this.#GetOptimizerFunction(dataJSON)
        );

        let hiddenLayersNodes = []

        for(let i = 0; i < dataHolder.weights.length; i++){
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
            dataHolder.activationFunctions[dataHolder.activationFunctions.length - 1]
        );
        
        //Make combine the weights
        let totalWeights = [];

        for(let i = 0; i < dataHolder.weights.length; i++){
            totalWeights.push(dataHolder.weights[i]);
            totalWeights.push(dataHolder.biases[i]);
        }

        let shape = []

        for(let i = 0; i < totalWeights.length; i++){
            shape.push(totalWeights[i].length)
        }

        //Figure out how to load weights into model

         
    }

    //#region Properties
    static #GetModelName(incomingJSON){
        let result = JSON.parse(incomingJSON).name;
        return result;
    }

    static #GetActivationFunctions(incomingJSON){
        let result = JSON.parse(incomingJSON).activationFunctions;
        return result;
    }

    static #GetWeightsAsArray(incomingJSON){
        let result = [];
        let data = JSON.parse(incomingJSON).weights;
        for(let i = 0; i < data.length; i++){
            result.push(Object.values(data[i]))
        }
        return result;
    }

    static #GetBiasAsArray(incomingJSON){
        let result = [];
        let data = JSON.parse(incomingJSON).biases;
        for(let i = 0; i < data.length; i++){
            result.push(Object.values(data[i]))
        }
        return result;
    }

    static #GetInputNodesAmount(incomingJSON){
        let result = JSON.parse(incomingJSON).inputNodesAmount
        return result;
    }

    static #GetOutputNodesAmount(incomingJSON){
        let result = JSON.parse(incomingJSON).outputNodesAmount
        return result;
    }

    static #GetLossFunction(incomingJSON){
        let result = JSON.parse(incomingJSON).lossFunction;
        return result;
    }

    static #GetOptimizerFunction(incomingJSON){
        let result = JSON.parse(incomingJSON).optimizerFunction;
        return result;
    }
    //#endregion
}

export class HiddenNodeRecommender{
    static GetHiddenNodesBySimpleMethod(numberOfInputNodes = 1.0, numberOfOutputNodes = 1.0){
        return Math.floor((numberOfInputNodes ** numberOfOutputNodes) ** 0.5);
    }

    static GetHiddenNodesByNonSimpleAmount(
        numberOfInputNodes = 1, 
        numberOfOutputNodes = 1, 
        numberOfSamples = 1, 
        arbitraryAlpha = 2){
        let numerator = numberOfSamples;
        let denominator = arbitraryAlpha * (numberOfInputNodes + numberOfOutputNodes);

        let result = numerator / denominator;
        return Math.floor(result);
    }

    static SetNumberOfHiddenNodesByLayer(totalNumberOfHiddenNodes = 1, desiredNumberOfLayers = 1){
        let hiddenNodesByLayer = [];
        let remainingHiddenNodes = Math.floor(totalNumberOfHiddenNodes);

        if (desiredNumberOfLayers === 0){
            return [];
        }

        if (desiredNumberOfLayers === 1){
            return [totalNumberOfHiddenNodes];
        }

        for(let i = 0; i < desiredNumberOfLayers; i++){
            let layerNodeAmount = Math.floor(remainingHiddenNodes / desiredNumberOfLayers);
            remainingHiddenNodes -= layerNodeAmount;
            hiddenNodesByLayer.push(remainingHiddenNodes);
        }

        return hiddenNodesByLayer;
    }
}