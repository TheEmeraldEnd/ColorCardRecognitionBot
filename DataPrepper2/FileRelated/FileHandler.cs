using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace DataPrepper.FileRelated
{
    public static class FileHandler
    {
        public static bool IsFileExist(string incomingPathAndFileName)
        {
            return File.Exists(incomingPathAndFileName);
        }

        public static bool IsDirectoryExist(string incomingPathAndName)
        {
            return Directory.Exists(incomingPathAndName);
        }

        public static string[] GetCurrentFiles(string incomingPath)
        {
            DirectoryInfo newDirectory = new DirectoryInfo(incomingPath);
            return newDirectory.GetFiles().Select(s => s.ToString()).ToArray();
        }

        public static void WriteTextFile(string incomingDirectory, string incomingFileName,
            string content)
        {
            if (!IsDirectoryExist(incomingDirectory))
            {
                Console.WriteLine("Error, directory doesn't exist");
                return;
            }

            string fileAndDirectoryPath = $"{incomingDirectory}/{incomingFileName}";

            if (!IsFileExist(fileAndDirectoryPath))
            {
                File.Create(fileAndDirectoryPath);
            }

            File.WriteAllText(fileAndDirectoryPath, content);
            Console.WriteLine("Write Successful");
        }
    }
}
