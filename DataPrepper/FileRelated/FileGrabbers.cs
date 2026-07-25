using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataPrepper.FileRelated
{
    public static class FileGrabbers
    {
        public static string[] GetImageTemplateNames()
        {
            return FileHandler.GetCurrentFiles(DataConfigHandler.AlteredDataConfigContent.RawTrainingTemplatesPath);
        }

        public static string[] GetImageTemplatePathsAndNames()
        {
            string directoryPath = DataConfigHandler.AlteredDataConfigContent.RawTrainingTemplatesPath;
            string[] namesAndPaths = GetImageTemplateNames().Select(s => $"{directoryPath}/{s}").ToArray();
            return namesAndPaths;
        }

        public static string[] GetImageTestNames()
        {
            return FileHandler.GetCurrentFiles(
                DataConfigHandler.AlteredDataConfigContent.TestsPath)
                .Select(s => s.Replace(".png", "")).ToArray();
        }

        public static string[] GetImageTestPathsAndNames()
        {

            string directoryPath = DataConfigHandler.AlteredDataConfigContent.TestsPath;
            string[] namesAndPaths = GetImageTestNames().Select(s => $"{directoryPath}/{s}").ToArray();
            return namesAndPaths;
        }

        public static string[] GetImageTestPathsAndNamesAndExtension()
        {
            string[] paths = GetImageTestPathsAndNames();
            paths = paths.Select(p => $"{p}.png").ToArray();
            return paths;
        }

        public static string[] GetOptions()
        {
            return DataConfigHandler.DataOptionsInfo.GetAllOptionFileNames();
        }

        public static string[] GetOptionPathsAndNames()
        {
            return DataConfigHandler.DataOptionsInfo.GetAllOptionFileNamesAndPaths();
        }
    }
}
