import * as MathExtensions from '../MathRelated/MathFunctions.js';

let hiddenActivationFunctions = [
    GetRelu(),
    GetTanh(),
    GetSigmoid(),
    GetElu(),
    GetSwish(),
    GetSoftplus()
]

let finalActivationFunctions = [
    GetSoftMax(),
    GetSigmoid()
]

export function GetRelu(){
    return 'relu'
}

export function GetTanh(){
    return 'tanh'
}
export function GetSigmoid(){
    return 'sigmoid';
}

export function GetElu(){
    return 'elu';
}

export function GetSwish(){    
    return 'swish'
}

export function GetSoftplus(){
    return 'softplus'
}
    
export function GetSoftMax(){
    return 'softmax'
}

export function GetRandomActivationFunction(maxChanceToRandomize = 1.0 ,isFinal = false, defaultActivation = ''){
    //Determine if activation function even changes
    let diceRoll = Math.random()

    //Add chance to randomize guards
    if (maxChanceToRandomize < 0 || maxChanceToRandomize > 1){
        console.log(`Please put max change to randomize between range [0, 1]`);
    }

    //Guard against invalid activation functions
    if (defaultActivation === ''){
        defaultActivation === GetRelu();
    }
    else if (!(hiddenActivationFunctions.includes(defaultActivation) || finalActivationFunctions.includes(defaultActivation))){
        console.log('Please give a valid default activation function');
    }

    if (!(diceRoll < maxChanceToRandomize)){
        return defaultActivation;
    }



    if (isFinal === false){
        return hiddenActivationFunctions[MathExtensions.GetRandomInt(0, hiddenActivationFunctions.length)];
    }
    else{
        return finalActivationFunctions[MathExtensions.GetRandomInt(0, finalActivationFunctions.length)];
    }
}