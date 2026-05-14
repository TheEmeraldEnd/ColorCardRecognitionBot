using DataPrepper.FileRelated;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataPrepper
{
    public static class Initializer
    {
        public static void Initialize()
        {
            DataConfigHandler.GenerateDataConfigFileAndDirectories();
            DataConfigHandler.SetToDefault();
        }
    }
}
