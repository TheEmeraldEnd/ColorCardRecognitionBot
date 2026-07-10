import * as tf from '@tensorflow/tfjs';
import * as MathFunctions from '../MathRelated/MathFunctions.js';

export function RandomizeWeights(incomingweights, maxWeightChangeVariation = 0.01, maxChanceWeightMutates = 0.01){
    for(let i = 0; i < incomingweights.length; i++){
        let tempWeights = incomingweights[i];

        let tempShape = tempWeights.shape;
        let tempArrayOfWeights = tempWeights.dataSync()
        tempArrayOfWeights = tempArrayOfWeights.map(e => RandomizeWeight(e, maxWeightChangeVariation, maxChanceWeightMutates))

        tempWeights = tf.tensor(tempArrayOfWeights, tempShape);
        
        incomingweights[i] = tempWeights;
    }

    return incomingweights
}

export function RandomizeWeight(incomingWeight, maxWeightChangeVariation, maxChanceWeightMutates){
    //Initialize the result
    let result = incomingWeight;

    //Determine if result should be changed
    if (!(Math.random() <= maxChanceWeightMutates)){
        return result;
    }

    //Get the amount the result will change by percentage
    let changeInAmount = maxChanceWeightMutates * Math.random();
    let isNegative = MathFunctions.RandomizeNegativeOrPositive();
    changeInAmount *= isNegative;
    result *= (1 + changeInAmount);

    return result;
}