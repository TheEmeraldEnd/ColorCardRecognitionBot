using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataPrepper.GenerationRelated
{
    /// <summary>
    /// A subsection of a bitmap
    /// </summary>
    public class BitmapSubSection
    {
        public Bitmap BitmapSection;
        private System.Random _randomObject;
        public BitmapSubSection(Bitmap incomingBitmap,
            int xPos1, int yPos1,
            int xPos2, int yPos2)
        {

            Rectangle sectionDimentions = new Rectangle(new Point(xPos1, yPos1),
                new Size(xPos2 - xPos1, yPos2 - yPos1));

            BitmapSection = incomingBitmap.Clone(sectionDimentions, System.Drawing.Imaging.PixelFormat.Format32bppRgb);
            _randomObject = new Random(DateTime.UtcNow.Millisecond);

        }

        public BitmapSubSection(Bitmap incomingBitmap)
        {
            int xPos1 = 1;
            int yPos1 = 1;
            int xPos2 = incomingBitmap.Width - 1;
            int yPos2 = incomingBitmap.Height - 1;

            Rectangle sectionDimentions = new Rectangle(new Point(xPos1, yPos1),
                new Size(xPos2 - xPos1, yPos2 - yPos1));

            BitmapSection = incomingBitmap.Clone(sectionDimentions, System.Drawing.Imaging.PixelFormat.Format32bppRgb);
            _randomObject = new Random(DateTime.UtcNow.Millisecond);
        }

        public BitmapSubSection[] DevideBitmapSubsection(int ammountOfWidth, int ammountOfHeight)
        {
            List<BitmapSubSection> bitmapSubsections = new List<BitmapSubSection>();
            double totalPixelWidth = BitmapSection.Width;
            double totalPixelHeight = BitmapSection.Height;
            double subsectionWidth = ((double)BitmapSection.Width) / ((double)ammountOfWidth);
            double subsectionHeight = ((double)BitmapSection.Height) / ((double)ammountOfHeight);
            for (int w = 0; w < ammountOfWidth; w++)
            {
                for (int h = 0; h < ammountOfHeight; h++)
                {
                    //int x1 = (int)((subsectionWidth * (w - 1))/totalPixelWidth) + 2;
                    //int y1 = (int)((subsectionHeight * (h - 1))/totalPixelHeight) + 2;
                    //int x2 = (int)((subsectionWidth * w)/totalPixelWidth);
                    //int y2 = (int)((subsectionHeight * h)/totalPixelHeight);

                    int x1 = (int)subsectionWidth * w;
                    int y1 = (int)subsectionHeight * h;
                    int x2 = (int)subsectionWidth * (w + 1);
                    int y2 = (int)subsectionHeight * (h + 1);

                    bitmapSubsections.Add(new BitmapSubSection(BitmapSection, x1, y1, x2, y2));
                }
            }

            bitmapSubsections.TrimExcess();

            return bitmapSubsections.ToArray();

        }

        /// <summary>
        /// Randomizes the white backgrounds of images, must be 255, 255, 255
        /// </summary>
        public void RandomizeWhitePixels()
        {
            int width = BitmapSection.Width;
            int height = BitmapSection.Height;

            for (int h = 0; h < height; h++)
            {
                for (int w = 0; w < width; w++)
                {
                    //May be a slow method. Look for optimization later
                    var pixel = BitmapSection.GetPixel(w, h);

                    if (pixel == Color.FromArgb(pixel.A, 255, 255, 255))
                    {
                        int a = 255;
                        int r = _randomObject.Next(0, 255);
                        int g = _randomObject.Next(0, 255);
                        int b = _randomObject.Next(0, 255);


                        Color newColor = Color.FromArgb(a, r, g, b);
                        

                        BitmapSection.SetPixel(w, h, newColor);
                        
                    }

                }
            }
        }

        /// <summary>
        /// Randomizes the size of an image. 
        /// </summary>
        /// <param name="incomingBitmap">
        ///     The incoming bitmap of an image.
        /// </param>
        /// <param name="percentageReductionAmmount">
        ///     The amount of reduction an image can be reduced by with each side (not total, but each).
        /// </param>
        /// <returns></returns>
        public static BitmapSubSection RandomizeSize(Bitmap incomingBitmap, double percentageReductionAmmount)
        {
            Random randomObject = new Random(DateTime.UtcNow.Millisecond);

            double width = incomingBitmap.Width;
            double height = incomingBitmap.Height;

            int xPos1 = (int)(0 + (randomObject.NextDouble(0, percentageReductionAmmount) * width));
            int xPos2 = (int)(width - (randomObject.NextDouble(0, percentageReductionAmmount) * width));
            int yPos1 = (int)(0 + (randomObject.NextDouble(0, percentageReductionAmmount) * height));
            int yPos2 = (int)(height - (randomObject.NextDouble(0, percentageReductionAmmount) * height));

            return new BitmapSubSection(incomingBitmap, xPos1, yPos1, xPos2, yPos2);
        }
    }
}
