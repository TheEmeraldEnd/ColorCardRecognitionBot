import * as FileHandler from './FileRelated/fileHandler.js';
import * as HistogramHandler from './FileRelated/histogramHandler.js'
import * as OptionsHandler from './FileRelated/optionHandler.js'

import * as MLHandler from './MachineLearningRelated/MLHandler.js'
import * as TrainingDataHandler from './MachineLearningRelated/TrainingDataHandler.js';
import * as tf from '@tensorflow/tfjs'

import * as DataHolder from "./DataRelated/DataHolder.js";
import * as DataTranslator from "./DataRelated/DataTranslator.js";
import * as DataComparer from "./DataRelated/DataComparer.js";

import * as MathExtension from "./MathRelated/MathFunctions.js"
//To Test Of model building
//Source: https://curiousily.com/posts/build-a-simple-neural-network-with-tensorflow-js-in-javascript/

//#region Test region
//Make the data for rates of infection
//DATA is current day infections
//nextDayInfections is the expected results
// const DATA = tf.tensor([

//     [2.0, 1.0],
//     [5.0, 1.0],
//     [7.0, 4.0],
//     [12.0, 5.0],
// ])
// const nextDayInfections = tf.expandDims(tf.tensor([5.0, 7.0, 12.0, 19.0]), 1)

// //Get the hidden size of the inputs
// const HIDDEN_SIZE = 4;

// //Create the sequential (input data is important)
// const newModel = new MLHandler.ModelClass();
// newModel.InitializeSequentialModel();

// //Add first hidden layer
// newModel.AddLayerAfterInputLayer(
//   [DATA.shape[1]],
//   HIDDEN_SIZE,
//   'tanh'
// );

// //Create the second hidden layer
// newModel.AddLayer(
//   HIDDEN_SIZE,
//   'tanh'
// );

// //Create the last hidden layer
// newModel.AddLayer(
//   1
// );

// //Show the summary of the model
// newModel.GetSummary();

// //The learning rate
// const ALPHA = 0.001;

// //Calculate the loss and optimization functions.
// //The loss function is how close the function is to correct answer
// //Loss parameter is how it is caluclated
// newModel.CompileMachine('meanSquaredError', tf.train.sgd(ALPHA));

// //trains the model
// //newModel.model.summary();
// await newModel.Fit(DATA, nextDayInfections, 2000, 10);

// // //Make the prediction
// const lastDayFeatures = tf.tensor([[12.0, 5.0]]);
// newModel.predict(lastDayFeatures);
//#endregion

let trainingHistograms = HistogramHandler.MonochromeClass.GetAllHistograms();
let formattedTrainingData = DataHolder.DataHolder.InitializeNewDataHolder(trainingHistograms, OptionsHandler.GetOptionNames());

let numberOfInputNodes = formattedTrainingData.GetLengthsOfRawColorArray();
console.log(numberOfInputNodes)
let numberOfOutputNodes = formattedTrainingData.GetPossibleOptionsLength();

let totalHiddenNodes = MLHandler.HiddenNodeRecommender.GetHiddenNodesBySimpleMethod(numberOfInputNodes, numberOfOutputNodes);
let hiddenLayerAmmount = 2;
let hiddenNodesPerLayer = MLHandler.HiddenNodeRecommender.SetNumberOfHiddenNodesByLayer(totalHiddenNodes, hiddenLayerAmmount);

const newModel = new MLHandler.ModelClass();
newModel.InitializeSequentialModel();

newModel.ConfigureModel(
  numberOfInputNodes,
  hiddenNodesPerLayer,
  numberOfOutputNodes,
  'ReLU',
  'sigmoid'
);

newModel.CompileMachine('meanSquaredError', 'sgd');

//TODO: Find out why fitting doesn't work
await newModel.Fit(
  formattedTrainingData.GetRawColorDataAsTensor(),
  DataTranslator.BinaryTranslator.LabelsToIndexesTensor(formattedTrainingData.GetLabelsAsArray(), formattedTrainingData.GetOptionNames()),
  20000,
  10
);
newModel.GetSummary();

let rawTensorResult = newModel.predict(formattedTrainingData.GetRawColorDataAsTensor());
rawTensorResult.print();
formattedTrainingData.GetLabelsAsTensor().print();

let rawArrayResult = rawTensorResult.dataSync();

let result = DataTranslator.BinaryTranslator.IndexesToLabels(rawTensorResult.arraySync(), formattedTrainingData.GetOptionNames());

DataComparer.CompareLabels(result, formattedTrainingData.GetLabelsAsArray());


// let monochromeHistograms = HistogramHandler.MonochromeClass.GetAllHistograms();
// let dataHolder = DataHolder.DataHolder.InitializeNewDataHolder(monochromeHistograms, OptionsHandler.GetOptionNames());
// dataHolder.print();