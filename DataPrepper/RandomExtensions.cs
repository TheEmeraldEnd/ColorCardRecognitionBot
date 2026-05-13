using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

public static class RandomExtensions
{
    /// <summary>
    /// Allows the randomization of a double. Algorithm comes from here.
    ///     
    /// Michael. (2009, June 30). Random Number Between 2 Double Numbers. 
    ///     c# - Random Number Between 2 Double Numbers - Stack Overflow. 
    ///     https://stackoverflow.com/questions/1064901/random-number-between-2-double-numbers
    /// 
    /// Altered for readability
    /// Interval [minValue,maxValue)
    /// </summary>
    /// <param name="random"></param>
    /// <param name="minValue"></param>
    /// <param name="maxValue"></param>
    /// <returns></returns>
    public static double NextDouble(this Random random, double minValue, double maxValue)
    {
        //generates a value inbetween [0,1)
        //  then multiplies it with the distance from the max and min. 
        //  Then  shifts it by min value. Correcting for the minimum range.
        return random.NextDouble() * (maxValue - minValue) + minValue;
    }
}

