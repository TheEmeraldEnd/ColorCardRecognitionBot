using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Security.Policy;
using System.Text;
using System.Threading.Tasks;
using DataPrepper.FileRelated;
using Newtonsoft.Json;

namespace DataPrepper.GenerationRelated
{
    public enum ValueMeasured
    {
        Color,
        Brightness
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
            public ValueMeasured FilterType
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
                ValueMeasured incomingFilter,
                double[] incomingColorArray)
            {
                Name = incomingName;
                FilterType = incomingFilter;
                ColorArray = incomingColorArray;
            }
        }

        public const int defaultPercentileGroup = 24;

        public static string SerializeJSON(Histogram incomingHistogram)
        {
            return JsonConvert.SerializeObject(incomingHistogram);
        }

        public static Histogram DeserializeJSON(string incomingJson)
        {
            return JsonConvert.DeserializeObject<Histogram>(incomingJson);
        }

        public static void ConvertAndSaveAllTestHistogram(
            Bitmap incomingBitmap,
            string nameOfBitmap,
            int groupDivisibilityNumber = defaultPercentileGroup)
        {
            var values = Enum.GetValues(typeof(ValueMeasured)).Cast<ValueMeasured>();
            foreach (var value in values) {
                ConvertAndSaveTestHistogram(incomingBitmap, nameOfBitmap, value, groupDivisibilityNumber);
            }
            
        }

        public static void ConvertAndSaveTestHistogram(
            Bitmap incomingBitmap,
            string nameOfBitmap,
            ValueMeasured valueType,
            int groupDivisibilityNumber = defaultPercentileGroup)
        {

            if (valueType == ValueMeasured.Color)
            {
                Histogram newHistogram =
                    ConvertToNormalHistogram(incomingBitmap, nameOfBitmap, groupDivisibilityNumber);
                HistogramFileHandler.SaveHistogramJSON(
                    SerializeJSON(newHistogram),
                    DataConfigHandler.AlteredDataConfigContent.TestingHistogramsColorfulPath);
            }

            if (valueType == ValueMeasured.Brightness)
            {
                
                Histogram newHistogram =
                    ConvertToBrightnessHistogram(incomingBitmap, nameOfBitmap, groupDivisibilityNumber);
                
                HistogramFileHandler.SaveHistogramJSON(
                    SerializeJSON(newHistogram),
                    DataConfigHandler.AlteredDataConfigContent.TestingHistogramsMonochromePath);
            }
        }

        public static void ConvertAndSaveAllHistograms(
            Bitmap incomingBitmap,
            string nameOfBitmap,
            int groupDivisibilityNumber = defaultPercentileGroup)
        {
            var values = Enum.GetValues(typeof(ValueMeasured)).Cast<ValueMeasured>();
            foreach(var value in values)
            {
                ConvertAndSaveHistogram(incomingBitmap, nameOfBitmap, value, groupDivisibilityNumber);
            }
        }

        public static void ConvertAndSaveHistogram(
            Bitmap incomingBitmap,
            string nameOfBitmap,
            ValueMeasured valueType,
            int groupDivisibilityNumber = defaultPercentileGroup)
        {
            
            if (valueType == ValueMeasured.Color)
            {
                Histogram newHistogram =
                    ConvertToNormalHistogram(incomingBitmap, nameOfBitmap, groupDivisibilityNumber);

                HistogramFileHandler.SaveHistogramJSON(
                    SerializeJSON(newHistogram),
                    DataConfigHandler.AlteredDataConfigContent.TrainingHistogramsColorfulPath);
            }
            
            if (valueType == ValueMeasured.Brightness)
            {
                
                Histogram newHistogram =
                    ConvertToBrightnessHistogram(incomingBitmap, nameOfBitmap, groupDivisibilityNumber);
                
                HistogramFileHandler.SaveHistogramJSON(
                    SerializeJSON(newHistogram),
                    DataConfigHandler.AlteredDataConfigContent.TrainingHistogramsMonochromePath);
            }
        }

        public static Histogram ConvertToNormalHistogram(
            Bitmap incomingBitmap,
            string nameOfBitmap,
            int groupDivisibilityPerColor = defaultPercentileGroup)
        {
            ValueMeasured filterType = ValueMeasured.Color ;
            
            //Generate Color array
            int[] redArray = new int[groupDivisibilityPerColor];
            int[] greenArray = new int[groupDivisibilityPerColor];
            int[] blueArray = new int[groupDivisibilityPerColor];

            for (int h = 0; h < incomingBitmap.Height; h++)
            {
                for(int w = 0; w < incomingBitmap.Width; w++)
                {
                    var pixel = incomingBitmap.GetPixel(w, h);
                    
                    int redIndex = DecideWhichIndex(groupDivisibilityPerColor, pixel.R, 256);
                    redArray[redIndex]++;

                    int greenIndex = DecideWhichIndex(groupDivisibilityPerColor, pixel.G, 256);
                    greenArray[greenIndex]++;

                    int blueIndex = DecideWhichIndex(groupDivisibilityPerColor, pixel.B, 256);
                    blueArray[blueIndex]++;
                }
            }
            

            //Set arrays to percentages
            int redSum = redArray.Sum();
            double[] redPercentileArray = redArray.Select(n => ((double)n / (double)redSum)).ToArray();

            int greenSum = greenArray.Sum();
            double[] greenPercentileArray = greenArray.Select(n => ((double)n / (double)redSum)).ToArray();

            int blueSum = blueArray.Sum();
            double[] bluePercentileArray = blueArray.Select(n => ((double)n / (double)redSum)).ToArray();

            //Set to one array [r, g, b]
            List<double> combinationList = new List<double>();

            for(int i = 0; i < redPercentileArray.Length; i++)
            {
                combinationList.Add(redPercentileArray[i]);
            }
            for(int i = 0; i < greenPercentileArray.Length; i++)
            {
                combinationList.Add(greenPercentileArray[i]);
            }
            for(int i = 0; i < bluePercentileArray.Length; i++)
            {
                combinationList.Add(bluePercentileArray[i]);
            }

            Histogram newHistogram = new Histogram(nameOfBitmap, ValueMeasured.Color, combinationList.ToArray());
            return newHistogram;
        }

        public static Histogram ConvertToBrightnessHistogram(
            Bitmap incomingBitmap,
            string nameOfBitmap,
            int colorGroupsPercentiles = defaultPercentileGroup)
        {
            
            ValueMeasured filterType = ValueMeasured.Brightness;
            
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
                    if (index == colorGroupsPercentiles)
                    {
                        index -= 1;
                    }
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

            Histogram result = new Histogram(nameOfBitmap, ValueMeasured.Brightness, percentagesArray);
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
