import * as FileHandler from './fileHandler.js';

//const dataTrainingPath = "../DataRelated/Data/Data_Training";

//const colorfulHistogramDirPath = `${dataTrainingPath}/Data_Histogram_Color`;

export class ColorfulClass{
    static colorfulHistogramDirPath = `../DataRelated/Data/Data_Training/Data_Histogram_Color`;
    
    static GetHistogram(incomingHistogramName = ""){
        let histogramContent = this.GetHistogramContent(incomingHistogramName);
        let parsedJsonContent = JSON.parse(histogramContent);

        let jsonColorArray = parsedJsonContent.ColorArray;
        let colorArray = [];
        
        for(let i = 0; i < jsonColorArray.length; i++){
            colorArray.push(jsonColorArray[i])
        }

        let histogram = new Histogram(parsedJsonContent.Name, parsedJsonContent.FilterType, colorArray);
        return histogram;
    }

    static GetHistogramContent(incomingHistogramName = ""){
        let testFilePath = incomingHistogramName.replace('.txt');
        testFilePath += '.txt';
        testFilePath = `${this.colorfulHistogramDirPath}/${incomingHistogramName}`;
        

        if (!FileHandler.IsFileOrDirectoryExist(testFilePath)){
            console.log(`File ${testFilePath} doesn't exist`);
            return;
        }

        let histogramContent = FileHandler.ReadFromFile(testFilePath);

        return histogramContent;
    }

    static GetHistogramNamesAndRelativePaths(){
        let histogramNames =  GetMonochromeHistogramNamesAndExtensions();

        for(let i = 0; i < histogramNames.length; i++){
        histogramNames[i] = `${this.colorfulHistogramDirPath}/${histogramNames[i]}`
        }

        return histogramNames;
    }

    static GetHistogramNamesAndExtensions(){
        let histogramNames = FileHandler.ReadDirectoryContent(this.colorfulHistogramDirPath);
        return histogramNames;
    }

}

export class MonochromeClass{
    static monochromeHistogramDirPath = `../DataRelated/Data/Data_Training/Data_Histogram_Monochrome`;
    
    static GetHistogram(incomingHistogramName = ""){
        let histogramContent = this.GetHistogramContent(incomingHistogramName);
        let parsedJsonContent = JSON.parse(histogramContent);

        let jsonColorArray = parsedJsonContent.ColorArray;
        let colorArray = [];
        
        for(let i = 0; i < jsonColorArray.length; i++){
            colorArray.push(jsonColorArray[i])
        }

        let histogram = new Histogram(parsedJsonContent.Name, parsedJsonContent.FilterType, colorArray);
        return histogram;
    }

    static GetHistogramContent(incomingHistogramName = ""){
        let testFilePath = incomingHistogramName.replace('.txt', '');
        testFilePath += '.txt';
        testFilePath = `${this.monochromeHistogramDirPath}/${incomingHistogramName}`;
        

        if (!FileHandler.IsFileOrDirectoryExist(testFilePath)){
            console.log(`File ${testFilePath} doesn't exist`);
            return;
        }

        let histogramContent = FileHandler.ReadFromFile(testFilePath);
        return histogramContent;
    }

    static GetHistogramNamesAndRelativePaths(){
        let histogramNames =  GetMonochromeHistogramNamesAndExtensions();

        for(let i = 0; i < histogramNames.length; i++){
        histogramNames[i] = `${this.monochromeHistogramDirPath}/${histogramNames[i]}`
        }

        return histogramNames;
    }

    static GetHistogramNamesAndExtensions(){
        let histogramNames = FileHandler.ReadDirectoryContent(this.monochromeHistogramDirPath);
        return histogramNames;
    }

}


class Histogram{
    constructor(name = "", filterType = 0, colorArray = []){
        this.name = name;
        this.filterType = filterType;
        this.colorArray = colorArray;
    }

    
}




function DisplayArray(incomingArray){
    incomingArray.forEach( item => {
        console.log(item);
    })
}

export function Test(){
    let incomingHistogram = ColorfulClass.GetHistogram(ColorfulClass.GetHistogramNamesAndExtensions()[0]);
    console.log(incomingHistogram);
}