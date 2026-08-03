import * as FileHandler from "../FileRelated/FileHandler.js";
import * as HistogramHandler from "../FileRelated/histogramHandler.js";
import * as OptionsHandler from "../FileRelated/optionHandler.js";

import * as MLHandler from "../MachineLearningRelated/MLHandler.js";
import * as tf from "@tensorflow/tfjs";

import * as DataHolder from "../DataRelated/DataHolder.js";
import * as DataTranslator from "../DataRelated/DataTranslator.js";
import * as DataComparer from "../DataRelated/DataComparer.js";

import * as MathExtension from "../MathRelated/MathFunctions.js";

import * as MLGroupHandler from "../MachineLearningRelated/GroupMLHandler.js";

import * as WeightRandomizer from "../MachineLearningRelated/WeightRandomizer.js";
import * as ActivationFunctions from "../MachineLearningRelated/ActivationFunctions.js";

import { DeleteGroupIfExists } from "../FileRelated/GroupLoaderHandler.js";

export async function TrainingThenRun() {
  let trainingHistograms = HistogramHandler.MonochromeClass.GetAllHistograms();
  let formattedTrainingData = DataHolder.DataHolder.InitializeNewDataHolder(
    trainingHistograms,
    OptionsHandler.GetOptionNames(),
  );
  let numberOfInputNodes = formattedTrainingData.GetLengthsOfRawColorArray();
  let numberOfOutputNodes = formattedTrainingData.GetPossibleOptionsLength();
  let totalHiddenNodes =
    MLHandler.HiddenNodeRecommender.GetHiddenNodesBySimpleMethod(
      numberOfInputNodes,
      numberOfOutputNodes,
    );
  let hiddenLayerAmmount = 2;
  let hiddenNodesPerLayer =
    MLHandler.HiddenNodeRecommender.SetNumberOfHiddenNodesByLayer(
      totalHiddenNodes,
      hiddenLayerAmmount,
    );
  //#region Group training
  let testGroupName = "AlotaBots";
  let amountOfBotsTested = 10;
  let botGroup = new MLGroupHandler.GroupMachineClass(
    amountOfBotsTested,
    testGroupName,
  );
  let hiddenActivationFunction = ActivationFunctions.GetRelu();
  let finalActivationFunction = ActivationFunctions.GetSigmoid();
  botGroup.ConfigureModel(
    numberOfInputNodes,
    hiddenNodesPerLayer,
    numberOfOutputNodes,
    hiddenActivationFunction,
    finalActivationFunction,
  );
  botGroup.GetSummary();
  botGroup.CompileMachines();
  await botGroup.FitDataWithBatching(
    formattedTrainingData.GetRawColorDataAsTensor(),
    DataTranslator.BinaryTranslator.LabelsToIndexesTensor(
      formattedTrainingData.GetLabelsAsArray(),
      formattedTrainingData.GetOptionNames(),
    ),
    formattedTrainingData.GetOptionNames(),
    20,
    10,
    5,
  );
  botGroup.GetSummary();

  //TODO: Set up predictiona and training testing

  //   let predictionTensor = botGroup.bots[0].predict(
  //     formattedTrainingData.GetRawColorDataAsTensor(),
  //   );
  //   let predictedLabels = DataTranslator.BinaryTranslator.IndexesToLabels(
  //     predictionTensor.arraySync(),
  //     formattedTrainingData.GetOptionNames(),
  //   );
  //   let actualLabels = formattedTrainingData.GetLabelsAsArray();
  //   botGroup.bots[0].LogAccuracy(predictedLabels, actualLabels);
  //Get prediction tensors
  let predictionTensors = botGroup.PredictAll(
    formattedTrainingData.GetRawColorDataAsTensor(),
  );
  let predictedLabelses = [];
  for (let i = 0; i < predictionTensors.length; i++) {
    predictedLabelses.push(
      DataTranslator.BinaryTranslator.IndexesToLabels(
        predictionTensors[i].arraySync(),
        formattedTrainingData.GetOptionNames(),
      ),
    );
  }
  let actualLabels = formattedTrainingData.GetLabelsAsArray();
  //botGroup.PredictAllAndSort(predictedLabelses, actualLabels);
  botGroup.SaveGroup();
  botGroup = MLGroupHandler.GroupMachineClass.LoadGroup(testGroupName);
  //#endregion

  function PredictOnFinalData(incomingModel, incomingFormattedFinalData) {
    let rawTensorResult = incomingModel.predict(
      incomingFormattedFinalData.GetRawColorDataAsTensor(),
    );

    rawTensorResult.print();
    incomingFormattedFinalData.GetLabelsAsTensor().print();

    let rawArrayResult = rawTensorResult.dataSync();

    let result = DataTranslator.BinaryTranslator.IndexesToLabels(
      rawTensorResult.arraySync(),
      incomingFormattedFinalData.GetOptionNames(),
    );

    DataComparer.CompareLabels(
      result,
      incomingFormattedFinalData.GetLabelsAsArray(),
    );
  }

  function PredictOnTrainingData(incomingGroup, formattedTrainingData) {
    let rawTensorResult = incomingGroup.PredictAll();

    // let rawTensorResult = incomingModel.predict(
    //   formattedTrainingData.GetRawColorDataAsTensor(),
    // );
    // rawTensorResult.print();
    // formattedTrainingData.GetLabelsAsTensor().print();

    // let rawArrayResult = rawTensorResult.dataSync();

    // let result = DataTranslator.BinaryTranslator.IndexesToLabels(
    //   rawTensorResult.arraySync(),
    //   formattedTrainingData.GetOptionNames(),
    // );

    // DataComparer.CompareLabels(
    //   result,
    //   formattedTrainingData.GetLabelsAsArray(),
    // );
  }
}

export async function RunGenerational() {}

export async function RunSteadyGenerational() {}

export async function RunLearningGenerational() {}
