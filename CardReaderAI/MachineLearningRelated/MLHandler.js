import * as tf from '@tensorflow/tfjs';

export class ModelClass{

    constructor(){
        this.model = tf.sequential();
    }

    InitializeSequentialModel(){
        this.model = tf.sequential();
        console.log(`Initialization for ${this.model.name} is complete`)
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

        console.log(`Configuration for ${this.model.name} complete`);
    }

    GetSummary(){
        this.model.summary();
    }

    CompileMachine(lossFunction = 'meanSquaredError', icomingOptimizer = 'sgd'){
        this.model.compile({
            optimizer: icomingOptimizer,
            loss: lossFunction
        });

        console.log(`Compilation for ${this.model.name} is complete`)
    }

    async Fit(inputData, incomingOutputExpected, totalEpochAmount = 100, epochLogIteration = 10 ){
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
            }
        )

        console.log(`Fitting for ${this.model.name} is complete`);
    }

    predict(incomingData){
        let result = this.model.predict(incomingData);
        console.log(`Preidction for ${this.model.name} is complete`)
        return result;
    }

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