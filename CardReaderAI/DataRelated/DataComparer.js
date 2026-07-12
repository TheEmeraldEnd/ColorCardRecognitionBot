export function CompareLabels(predictedLabels = [], actualLabels = []){
    console.log(CompareLabelsReturnString(predictedLabels, actualLabels));
}

export function CopmareLabelsStringReturnFloat(predictedLabels = [], actualLabels = []){
    let correctCount = 0.0;
    let totalCount = 0.0;

    for(let i = 0; i < predictedLabels.length; i++){
        if (predictedLabels[i] === actualLabels[i]){
            correctCount++;
        }
        totalCount++;
    }
    let tempAccuracy = correctCount/totalCount;
    console.log(`Accuracy = ${(tempAccuracy) * 100.0}%`)
    return tempAccuracy;
}

export function CompareLabelsReturnString(predictedLabels = [], actualLabels = []){
    if (predictedLabels.length !== actualLabels.length){
        console.error(`Prediction and actual label lengths don't match. Please make sure data is same.`);
        return '';
    }

    let resultString = "";

    let correctCount = 0.0;
    let totalCount = 0.0;
    resultString += "\nPredicted\t\t||\t\tActual\t\t||\t\tcount";
    for(let i = 0; i < predictedLabels.length; i++){
        if (predictedLabels[i] === actualLabels[i]){
            correctCount++;
        }
        totalCount++;

        resultString += `\n${predictedLabels[i]}\t\t||\t\t${actualLabels[i]}\t\t||\t\t${correctCount}/${totalCount}`;
    }
    resultString += `\nAccuracy = ${(correctCount/totalCount ) * 100.0}%`;

    return resultString;
}