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
            Console.WriteLine(DataConfigHandler.AlteredDataConfigContent.RawTrainingTemplatesPath);
            
            string[] imagePaths = FileHandler.GetCurrentFiles(DataConfigHandler.AlteredDataConfigContent.RawTrainingTemplatesPath);
            string testImagePath = DataConfigHandler.AlteredDataConfigContent.RawTrainingTemplatesPath +
                '/' +
                imagePaths[0];
            Console.WriteLine(FileHandler.IsFileExist(testImagePath));
            Console.WriteLine(testImagePath);

            Bitmap newBitmap = ImageFileHandler.ReadPNGImage(testImagePath);

            BitmapSubSection testBitmapSubsection = BitmapSubSection.RandomizeSize(newBitmap, 0.1);
            testBitmapSubsection.RandomizeWhitePixels();
            

            ImageFileHandler.WritePNGImage(testBitmapSubsection.BitmapSection, DataConfigHandler.AlteredDataConfigContent.RawTrainingImagesPath, "THing");



            //Need to test bitmap subsection area and generate training data
        }
    }
}
