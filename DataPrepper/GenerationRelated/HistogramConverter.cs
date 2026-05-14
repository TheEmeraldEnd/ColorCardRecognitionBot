using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace DataPrepper.GenerationRelated
{
    public enum ColorFilter
    {
        Normal,
        Monochrome
    }

    public static class HistogramConverter
    {

        [Serializable]
        public class Histogram
        {
            [JsonProperty]
            public string Name
            {
                get; set;
            }

            [JsonProperty]
            public ColorFilter FilterType
            {
                get; set;
            }

            [JsonProperty]
            public double[] ColorArray
            {
                get; set;
            }

            public Histogram(
                string incomingName,
                ColorFilter incomingFilter,
                double[] incomingColorArray)
            {
                Name = incomingName;
                FilterType = incomingFilter;
                ColorArray = incomingColorArray;
            }
        }

        public static string SerializeJSON(Histogram incomingHistogram)
        {
            return JsonConvert.SerializeObject(incomingHistogram);
        }

        public static Histogram DeserializeJSON(string incomingJson)
        {
            return JsonConvert.DeserializeObject<Histogram>(incomingJson);
        }

        //public static Histogram ConvertToNormalHistogram(
        //    Bitmap incomingBitmap,
        //    string nameOfBitmap,
        //    int colorDivisibilityPerColor)
        //{
        //    ColorFilter filterType = ColorFilter.Normal;

        //    //Generate Color array
            
        //}

        public static Histogram ConvertToMonochromeHistogram(
            Bitmap incomingBitmap,
            string nameOfBitmap,
            int colorGroupsPercentiles)
        {
            ColorFilter filterType = ColorFilter.Monochrome;

            float minValue = 0;
            float maxValue = 1;

            //Generate Color Array 
            int[] brightnessArrayPercentiles = new int[colorGroupsPercentiles];

            for(int h = 0; h < incomingBitmap.Height; h++)
            {
                for(int w = 0; w < incomingBitmap.Width; w++)
                {
                    float pixelValue = incomingBitmap.GetPixel(w, h).GetBrightness();
                    int index = DecideWhichIndex(colorGroupsPercentiles, pixelValue, maxValue, minValue);
                    brightnessArrayPercentiles[index]++;
                }
            }

            //Convert to percentages
            double[] percentagesArray = new double[brightnessArrayPercentiles.Length];
            double sum = brightnessArrayPercentiles.Sum();
            for(int i = 0; i < brightnessArrayPercentiles.Length; i++)
            {
                percentagesArray[i] = brightnessArrayPercentiles[i] / sum;
            }

            Histogram result = new Histogram(nameOfBitmap, ColorFilter.Monochrome, percentagesArray);
            return result;
        }

        private static int DecideWhichIndex(int numberOfGroups, float incomingValue, float maxInclusiveBound,
            float minInclusiveBound = 0)
        {
            float adjustedPercentageValue = (incomingValue - minInclusiveBound) / maxInclusiveBound;

            float numberedGroupInBetween = adjustedPercentageValue * numberOfGroups;

            int corrispondingGroupNumber = (int)Math.Floor(numberedGroupInBetween);

            return corrispondingGroupNumber;
        }
    }
}
