export function CompareLabels(predictedLabels = [], actualLabels = []){
    if (predictedLabels.length !== actualLabels.length){
        console.error(`Prediction and actual label lengths don't match. Please make sure data is same.`);
    }

    let correctCount = 0.0;
    let totalCount = 0.0;
    console.log("Predicted\t\t||\t\tActual\t\t||\t\tcount")
    for(let i = 0; i < predictedLabels.length; i++){
        if (predictedLabels[i] === actualLabels[i]){
            correctCount++;
        }
        totalCount++;

        console.log(`${predictedLabels[i]}\t\t||\t\t${actualLabels[i]}\t\t||\t\t${correctCount}/${totalCount}`);
    }
    console.log(`Accuracy = ${(correctCount/totalCount ) * 100.0}%`)

}