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

            File.WriteAllText(fileAndDirectoryPath, content);
            Console.WriteLine("Write Successful");
        }

        /// <summary>
        /// Creates directories to a specified directory on path. 
        ///     Emphasis on ENSURE.
        /// </summary>
        /// <param name="incomingDirectoryPath"></param>
        public static void EnsurePriorDirectoriesExist(string incomingDirectoryPath)
        {
            Directory.CreateDirectory(incomingDirectoryPath);
        }

        public static void DeleteFile(string incomingFileAndPath)
        {
            if (IsFileExist(incomingFileAndPath))
            {
                File.Delete(incomingFileAndPath);
            }
        }

        public static void DeleteDirectory(string incomingDirectoryAndPath)
        {
            if (IsDirectoryExist(incomingDirectoryAndPath))
            {
                Directory.Delete(incomingDirectoryAndPath);
            }
        }
    }
}
