using DataPrepper.FileRelated;
using System;
using System.Drawing;

namespace DataPrepper.GenerationRelated
{
    public static class TemplateRandomizer
    {
        private static System.Random _randomObject = new Random(DateTime.UtcNow.Millisecond);

        //Need to test
        public static BitmapSubSection GenerateRandomBitmapSubsectionFromTemplate(
            string[] templatePaths, 
            double sizePercentage = 0.15f)
        {
            string randomTemplatePath = templatePaths[_randomObject.Next(0, templatePaths.Length)];
            string bitmapName = 
                randomTemplatePath
                    .Replace(DataConfigHandler.AlteredDataConfigContent.RawTrainingTemplatesPath + "/", "")
                    .Replace(".bmp", "")
                    .Replace(".png", "");

            Bitmap newBitmap = ImageFileHandler.ReadPNGImage(randomTemplatePath);

            BitmapSubSection testBitmapSubsection = BitmapSubSection.RandomizeSize(newBitmap, sizePercentage, bitmapName);
            testBitmapSubsection.RandomizeWhitePixels();

            return testBitmapSubsection;
        }
    }
}
