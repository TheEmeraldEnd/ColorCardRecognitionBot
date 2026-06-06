import * as tf from '@tensorflow/tfjs';
import * as HistogramHandler from '../FileRelated/histogramHandler.js'

export class DataHolder{
    constructor(rawDataColorArray = [], incomingLabelsAsStrings = [], incomingPossibleOptions = []){

        this.rawDataColorArray = rawDataColorArray;
        this.labels = incomingLabelsAsStrings;
        this.possibleOptions = incomingPossibleOptions;

        this.labels = this.labels.map(s => s.trim());
    }

    InitializeDataHolder(rawDataColorArray = [], incomingLabelsAsStrings = [], incomingPossibleOptions = []){
        this.rawDataColorArray = rawDataColorArray;
        this.labels = incomingLabelsAsStrings;
        this.possibleOptions = incomingPossibleOptions;

        for(let i = 0; i < this.labels.length; i++){
            let currentLabel = this.labels[i];
            if (!this.possibleOptions.includes(currentLabel)){
                console.log(`No option included in ${this}`);
            } 
        }
    }

    static InitializeNewDataHolder(histogramArray = [], incomingPossibleOptions = []){
        let tempRawColorArray = [];
        let tempLabelsArray = [];

        histogramArray.forEach(
            h => {
                tempRawColorArray.push(h.colorArray);
                tempLabelsArray.push(h.name);
            }
        );

        let tempHolder = new DataHolder(tempRawColorArray, tempLabelsArray, incomingPossibleOptions)
        return tempHolder;
    }

    print(){
        for(let i = 0; i < this.rawDataColorArray.length; i++){
            console.log(`Histogram [${i}]: ${this.labels[i]} [${this.rawDataColorArray[i]}]`)
        }
    }

    GetRawColorDataAsTensor(){
        let tempTensorResult = tf.tensor2d(this.rawDataColorArray);
        return tempTensorResult;
    }

    GetRawColorDataAsArray(){
        return this.colorArray;
    }

    GetLabelsAsTensor(){
        let tempTensorResult = tf.tensor1d(this.labels);
        return tempTensorResult;
    }

    GetOptionNames(){
        return this.possibleOptions;
    }

    GetOptionsLength(){
        return this.possibleOptions.length;
    }

    GetLabelsAsArray(){
        return this.labels;
    }

    GetLengthsOfRawColorArray(){
        return this.rawDataColorArray[0].length;
    }

    GetPossibleOptionsLength(){
        return this.possibleOptions.length;
    }
}