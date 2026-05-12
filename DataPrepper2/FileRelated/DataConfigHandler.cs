using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Newtonsoft;

namespace DataPrepper.FileRelated
{
    public static class DataConfigHandler
    {
        public static class DataConfigInfo
        {
            public static string DataConfigFilePath = "../../";
            public static string DataConfigFileName = "DataConfig.txt";
        }

        [Serializable]
        public class DataConfigContent
        {
            public DataConfigContent(
                string rawTrainingTemplatesPath = "",
                string rawTrainingImagesPath = "",
                string trainingHistogramsColorfulPath = "",
                string trainingHistogramsMonochromePath = "",
                string optionsPath = "",
                string testsPath = "")
            {
                RawTrainingTemplatesPath = rawTrainingTemplatesPath;
                RawTrainingImagesPath = rawTrainingImagesPath;
                TrainingHistogramsColorfulPath = trainingHistogramsColorfulPath;
                TrainingHistogramsMonochromePath = trainingHistogramsMonochromePath;
                OptionsPath = optionsPath;
                TestsPath = testsPath;
            }

            //Initialized as base set
            public string RawTrainingTemplatesPath { get; set; }
            public string RawTrainingImagesPath { get; set; }
            public string TrainingHistogramsColorfulPath { get; set; }
            public string TrainingHistogramsMonochromePath { get; set; }
            public string OptionsPath { get; set; }
            public string TestsPath { get; set; }

            //private static DataConfigContent _defaultDataConfigContent =
                
            public static DataConfigContent DefaultDataConfigContent
            {
                get
                {
                    return new DataConfigContent
                    {
                        RawTrainingTemplatesPath = "../../../DataRelated/Data/Data_Raw_Templates",
                        RawTrainingImagesPath = "../../../DataRelated/Data/Data_Training/Data_Raw_Training",
                        TrainingHistogramsColorfulPath = "../../../DataRelated/Data/Data_Training/Data_Histogram_Color",
                        TrainingHistogramsMonochromePath = "../../../DataRelated/Data/Data_Training/Data_Histogram_Monochrome",
                        OptionsPath = "../../../DataRelated/Data/Data_Options",
                        TestsPath = "../../../DataRelated/Data/Data_Test"
                    };
                }
            }

            public string[] GetAllFilePaths()
            {
                string[] filePathsArray = new []{
                    RawTrainingTemplatesPath,
                    RawTrainingImagesPath,
                    TrainingHistogramsColorfulPath,
                    TrainingHistogramsMonochromePath,
                    OptionsPath,
                    TestsPath
                };



                return filePathsArray;
            }
        }

        public static string SerializeJSON()
        {
            //Temporary until a customizable deserailized version of the content can be figured out
            return Newtonsoft.Json.JsonConvert.SerializeObject(DataConfigContent.DefaultDataConfigContent);
        }

        public static void GenerateDataConfigFile()
        {
            FileHandler.WriteTextFile(
                DataConfigInfo.DataConfigFilePath,
                DataConfigInfo.DataConfigFileName,
                SerializeJSON());
        }
    }
}
