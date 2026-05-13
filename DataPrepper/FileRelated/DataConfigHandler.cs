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

            public static string NameAndPath
            {
                get
                {
                    return DataConfigFilePath + "/" + DataConfigFileName;
                }
            }
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
                        RawTrainingTemplatesPath = "../../DataDefaults/Data_Templates",
                        RawTrainingImagesPath = "../../../DataRelated/Data/Data_Training/Data_Raw_Training",
                        TrainingHistogramsColorfulPath = "../../../DataRelated/Data/Data_Training/Data_Histogram_Color",
                        TrainingHistogramsMonochromePath = "../../../DataRelated/Data/Data_Training/Data_Histogram_Monochrome",
                        OptionsPath = "../../DataDefaults/Data_Options",
                        TestsPath = "../../DataDefaults/Data_Test"
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

        
        public static DataConfigContent AlteredDataConfigContent
        {
            get;
            set;
        }

        public static void DeserializeThenGenerate()
        {
            DeserializeJSON();
            GenerateDataConfigFileAndDirectories();
        }

        public static string SerializeJSON()
        {
            return Newtonsoft.Json.JsonConvert.SerializeObject(AlteredDataConfigContent);
        }

        public static void SetToDefault()
        {
            AlteredDataConfigContent = DataConfigContent.DefaultDataConfigContent;
        }

        public static void DeserializeJSON()
        {
            if (!FileHandler.IsFileExist(DataConfigInfo.NameAndPath))
            {
                GenerateDataConfigFileAndDirectories();
            }
            string incomingJSON = FileHandler.ReadTextFileContent(DataConfigInfo.NameAndPath);
            var thing = Newtonsoft.Json.JsonConvert.DeserializeObject<DataConfigContent>(incomingJSON);
            AlteredDataConfigContent = Newtonsoft.Json.JsonConvert.DeserializeObject<DataConfigContent>(incomingJSON);
        }

        public static void GenerateDataConfigFileAndDirectories()
        {
            GenerateDefaultDataConfigFile();
            GenerateDefaultDirectories();
        }

        private static void GenerateDefaultDataConfigFile()
        {
            FileHandler.WriteTextFile(
                DataConfigInfo.DataConfigFilePath,
                DataConfigInfo.DataConfigFileName,
                SerializeJSON());
        }

        private static void GenerateDefaultDirectories()
        {
            string[] allDefaultDirectories = DataConfigContent.DefaultDataConfigContent.GetAllFilePaths();
            foreach(var path in allDefaultDirectories)
            {
                FileHandler.EnsurePriorDirectoriesExist(path);
            }
        }

        public static void DeleteDefaultDirectoriesAndFile()
        {
            FileHandler.DeleteDirectory(DataConfigContent.DefaultDataConfigContent.RawTrainingImagesPath);
            FileHandler.DeleteDirectory(DataConfigContent.DefaultDataConfigContent.TrainingHistogramsColorfulPath);
            FileHandler.DeleteDirectory(DataConfigContent.DefaultDataConfigContent.TrainingHistogramsMonochromePath);

            FileHandler.DeleteFile(DataConfigInfo.NameAndPath);
        }
    }
}
