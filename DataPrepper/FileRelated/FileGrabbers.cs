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
    }
}
