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

export function GetRandomActivationFunction(isFinal = false){
    if (isFinal === false){
        return hiddenActivationFunctions[MathExtensions.GetRandomInt(0, hiddenActivationFunctions.length)];
    }
    else{
        return finalActivationFunctions[MathExtensions.GetRandomInt(0, finalActivationFunctions.length)];
    }
}