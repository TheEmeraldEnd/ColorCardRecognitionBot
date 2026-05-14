using DataPrepper.FileRelated;
using DataPrepper.GenerationRelated;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Drawing;
using DataPrepper.Console_Related;

namespace DataPrepper
{
    internal class Program
    {
        static void Main(string[] args)
        {
            Initializer.Initialize();

            ConsoleCommands.ActivateConsoleMode();



            //ImageFileHandler.WritePNGImage(
            //    newBitmapSubsection.BitmapSection, 
            //    DataConfigHandler.AlteredDataConfigContent.RawTrainingImagesPath, 
            //    newBitmapSubsection.BitmapName);

            

            //Need to test bitmap subsection area and generate training data
        }
    }
}
