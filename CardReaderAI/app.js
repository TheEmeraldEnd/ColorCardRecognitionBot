import * as FileHandler from './FileRelated/fileHandler.js';
import * as HistogramHandler from './FileRelated/histogramHandler.js'
import * as OptionsHandler from './FileRelated/optionHandler.js'

import * as MLHandler from './MachineLearningRelated/MLHandler.js'
import * as tf from '@tensorflow/tfjs'

import * as DataHolder from "./DataRelated/DataHolder.js";
import * as DataTranslator from "./DataRelated/DataTranslator.js";
import * as DataComparer from "./DataRelated/DataComparer.js";

import * as MathExtension from "./MathRelated/MathFunctions.js"

import * as MLGroupHandler from "./MachineLearningRelated/GroupMLHandler.js"

let trainingHistograms = HistogramHandler.MonochromeClass.GetAllHistograms();
let formattedTrainingData = DataHolder.DataHolder.InitializeNewDataHolder(trainingHistograms, OptionsHandler.GetOptionNames());

let numberOfInputNodes = formattedTrainingData.GetLengthsOfRawColorArray();
let numberOfOutputNodes = formattedTrainingData.GetPossibleOptionsLength();

let totalHiddenNodes = MLHandler.HiddenNodeRecommender.GetHiddenNodesBySimpleMethod(numberOfInputNodes, numberOfOutputNodes);
let hiddenLayerAmmount = 2;
let hiddenNodesPerLayer = MLHandler.HiddenNodeRecommender.SetNumberOfHiddenNodesByLayer(totalHiddenNodes, hiddenLayerAmmount);

//#region Single training
// let testModelName = 'SomeName'

// let newModel;


// if (!MLHandler.IsModelSaved(testModelName)){
//   newModel = new MLHandler.ModelClass(testModelName);

//   newModel.ConfigureModel(
//     numberOfInputNodes,
//     hiddenNodesPerLayer,
//     numberOfOutputNodes,
//     'ReLU',
//     'sigmoid'
//   );

//   newModel.CompileMachine('meanSquaredError', 'sgd');
// }
// else{
//   newModel = MLHandler.ModelClass.LoadModel(testModelName)
// }


// await newModel.FitDataWithBatching(
//   formattedTrainingData.GetRawColorDataAsTensor(),
//   DataTranslator.BinaryTranslator.LabelsToIndexesTensor(formattedTrainingData.GetLabelsAsArray(), formattedTrainingData.GetOptionNames()),
//   formattedTrainingData.GetOptionNames(),
//   20,
//   10,
//   5
// );
// newModel.GetSummary();

// let formattedFinalData = DataHolder.DataHolder.InitializeNewDataHolder(HistogramHandler.MonochromeTestingClass.GetAllHistograms(), OptionsHandler.GetOptionNames());
// PredictOnFinalData(newModel, formattedFinalData);
// //PredictOnTrainingData(newModel, formattedTrainingData);

// await newModel.SaveModel();


// function PredictOnFinalData(incomingModel, incomingFormattedFinalData){
  

//   let rawTensorResult = incomingModel.predict(incomingFormattedFinalData.GetRawColorDataAsTensor() );
//   console.log('thing')
  
//   rawTensorResult.print();
//   incomingFormattedFinalData.GetLabelsAsTensor().print();

//   let rawArrayResult = rawTensorResult.dataSync();

//   let result = DataTranslator.BinaryTranslator.IndexesToLabels(rawTensorResult.arraySync(), incomingFormattedFinalData.GetOptionNames());

//   DataComparer.CompareLabels(result, incomingFormattedFinalData.GetLabelsAsArray());
// }


// function PredictOnTrainingData(incomingModel, formattedTrainingData){
//     let rawTensorResult = incomingModel.predict(formattedTrainingData.GetRawColorDataAsTensor());
//     rawTensorResult.print();
//     formattedTrainingData.GetLabelsAsTensor().print();

//     let rawArrayResult = rawTensorResult.dataSync();

//     let result = DataTranslator.BinaryTranslator.IndexesToLabels(rawTensorResult.arraySync(), formattedTrainingData.GetOptionNames());

//     DataComparer.CompareLabels(result, formattedTrainingData.GetLabelsAsArray());
// }
//#endregion


//#region Group training
let testGroupName = 'AlotaBots'
let amountOfBotsTested = 10;
let botGroup = new MLGroupHandler.GroupMachineClass(amountOfBotsTested, testGroupName);

botGroup.ConfigureModel(
    numberOfInputNodes,
    hiddenNodesPerLayer,
    numberOfOutputNodes,
    'ReLU',
    'sigmoid');

botGroup.GetSummary();

botGroup.CompileMachines()

await botGroup.FitDataWithBatching(
    formattedTrainingData.GetRawColorDataAsTensor(),
    DataTranslator.BinaryTranslator.LabelsToIndexesTensor(formattedTrainingData.GetLabelsAsArray(), formattedTrainingData.GetOptionNames()),
    formattedTrainingData.GetOptionNames(),
    20,
    10,
    5
);

botGroup.GetSummary();

botGroup.predictAll(formattedTrainingData.GetRawColorDataAsTensor())[0].print();

//#endregion

