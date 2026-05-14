using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataPrepper.FileRelated
{
    public static class HistogramFileHandler
    {
        private static readonly Random _randomObject = new Random(DateTime.UtcNow.Millisecond);
        public static void SaveHistogramJSON(string incomingJson, string incomingDirectory)
        {
            string fileExtension = ".txt";
            string fileName = $"{_randomObject.Next(0, int.MaxValue)}";
            string fileNameWithExtension = $"{fileName}{fileExtension}";
            FileHandler.WriteTextFile(incomingDirectory, fileNameWithExtension, incomingJson);
        }
    }
}
