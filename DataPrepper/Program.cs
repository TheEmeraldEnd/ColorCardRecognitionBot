using DataPrepper.FileRelated;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataPrepper
{
    internal class Program
    {
        static void Main(string[] args)
        {
            DataConfigHandler.RefreshDataConfigFileAndDirectories();
        }
    }
}
