import * as HistogramRelated from "../FileRelated/histogramHandler.js";
import * as tf from '@tensorflow/tfjs';
import * as OptionssHandler from '../FileRelated/optionHandler.js'

class FormattedTrainingData{
    constructor(rawDataColorArray = [], incomingLabels = [], incomingPossibleOptions = []){
        this.rawDataColorArray = rawDataColorArray;
        this.labels = incomingLabels;
        this.possibleOptions = incomingPossibleOptions;
    }

    InitializeOptions(colorArrays, incomingOptionNamesArray){
        this.labels = incomingOptionNamesArray;
        this.rawDataColorArray = colorArrays;
    }

    print(){
        for(let i = 0; i < this.rawDataColorArray.length; i++){
            console.log(`${i} ${this.labels[i]}: ${this.rawDataColorArray[i]}`)
        }
    }

    GetRawColorDataAsTensor(){
        let tempTensorResult = tf.tensor2d(this.rawDataColorArray);
        return tempTensorResult;
    }

    GetLabelsAsTensor(){
        let tempTensorResult = tf.tensor1d(this.labels);
        return tempTensorResult;
    }

    GetPossibleOptionsAsTensor(){
        let tempTensorResult = tf.tensor(this.possibleOptions);
        return tempTensorResult;
    }

    GetPossibleOpionsLength(){
        return this.GetPossibleOptionsAsTensor().dataSync().length;
    }

    GetNumberOfSamples(){
        return this.rawDataColorArray.length;
    }

    GetNumberOfInputs(){
        return this.rawDataColorArray[0].length;
    }

    GetNumberOfOutputs(){
        return this.possibleOptions.length;
    }

    GetLabelsAsNumberedTensor(){
        let arrayOfTrueValues = [];

        for(let i = 0; i < this.labels.length; i++){
            let tempOptionNumberArray = [];

            for(let j = 0; j < this.possibleOptions.length; j++){
                
                if (this.labels[i] === this.possibleOptions[j]){
                    tempOptionNumberArray.push(1.0);
                }
                else{
                    tempOptionNumberArray.push(0.0);
                }
            }

            arrayOfTrueValues.push(tempOptionNumberArray)

            
        }

        return tf.tensor(arrayOfTrueValues);
    }
}

export function FormatTrainingData(incomingHistograms, possibleOptions){
    let trainingDataRaw = [];
    let labels = [];

    incomingHistograms.forEach(incomingHistogram => {
        let tempColorArray = incomingHistogram.colorArray;
        trainingDataRaw.push(tempColorArray);

        let tempOptionName = incomingHistogram.name;
        labels.push(tempOptionName);
    });



    let result = new FormattedTrainingData(trainingDataRaw, labels, possibleOptions);
    return result;
}
