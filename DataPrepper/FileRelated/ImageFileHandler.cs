using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataPrepper.FileRelated
{
    public static class ImageFileHandler
    {
        public static void WritePNGImage(Bitmap incomingBitmap, string bitmapDirectory, string bitmapName)
        {
            
            bitmapName = bitmapName.Replace(".bmp", "");
            bitmapName = bitmapName.Replace(".png", "");
            incomingBitmap.Save($"{bitmapDirectory}/{bitmapName}.png", System.Drawing.Imaging.ImageFormat.Png);
        }

        public static Bitmap ReadPNGImage(string incomingPathAndPNGName)
        {
            return new Bitmap(incomingPathAndPNGName);
        }

        public static string[] GetAllImageTemplates()
        {
            string templatePath = DataConfigHandler.AlteredDataConfigContent.RawTrainingTemplatesPath;
            string[] imageFileNames = FileHandler.GetCurrentFiles(templatePath);
            string[] imageFilePathsAndNames = imageFileNames.Select(f => $"{templatePath}/{f}").ToArray();
            return imageFilePathsAndNames;
        }
    }
}
