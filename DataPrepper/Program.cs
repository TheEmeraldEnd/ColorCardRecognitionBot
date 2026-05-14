using DataPrepper.FileRelated;
using DataPrepper.GenerationRelated;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Drawing;

namespace DataPrepper
{
    internal class Program
    {
        static void Main(string[] args)
        {
            DataConfigHandler.DeserializeThenGenerate();
            DataConfigHandler.SetToDefault();

            BitmapSubSection newBitmapSubsection = 
                TemplateRandomizer.GenerateRandomBitmapSubsectionFromTemplate(FileGrabbers.GetImageTemplatePathsAndNames());

            Console.WriteLine($"Image Name = {newBitmapSubsection.BitmapName}");

            var histogram = 
                HistogramConverter.ConvertToMonochromeHistogram(
                    newBitmapSubsection.BitmapSection,
                    newBitmapSubsection.BitmapName,
                    12);

            HistogramFileHandler.SaveHistogramJSON(
                HistogramConverter.SerializeJSON(histogram),
                DataConfigHandler.AlteredDataConfigContent.TrainingHistogramsMonochromePath);

            //ImageFileHandler.WritePNGImage(
            //    newBitmapSubsection.BitmapSection, 
            //    DataConfigHandler.AlteredDataConfigContent.RawTrainingImagesPath, 
            //    newBitmapSubsection.BitmapName);

            

            //Need to test bitmap subsection area and generate training data
        }
    }
}
