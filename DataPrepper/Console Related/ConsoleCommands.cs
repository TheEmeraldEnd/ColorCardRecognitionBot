using DataPrepper.FileRelated;
using DataPrepper.GenerationRelated;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Runtime.CompilerServices;
using System.Security.Policy;
using System.Text;
using System.Threading.Tasks;

namespace DataPrepper.Console_Related
{
    //TODO: Possibly call via attributes (unsure how currently)
    public static class ConsoleCommands
    {

        private static readonly Random _randomObject = new Random(DateTime.UtcNow.Millisecond);

        private static readonly string[] _exitCommands =
        {
            "EXIT",
            "QUIT",
            "Q",
            "E"
        };

        private static readonly string[] _entryQuips =
        {
            "What's the word, Hummingbird?",
            "What's that, Jack?",
            "How's the deal, Mr. Leal?",
            "What's to hone, Al Capone?",
            "Reddy? Freddy?",
            "I've got time, Einstein!",
            "General Kenobi. I've been expecting you!",
            "Hello There"
        };

        private static readonly string[] _exitQuips =
        {
            "What's the hurry, Madam Curie?",
            "See ya later, Al Agator",
            "got to go, Rhino?",
            "In case I don’t see ya, good afternoon, good evening, and good night!",
            "So long, and thanks for all the bits."
        };

        public static void ActivateConsoleMode()
        {
            string command = "";
            do
            {
                Console.WriteLine();
                NeutralComputerTalk(_entryQuips[_randomObject.Next(0, _entryQuips.Length)]);

                command = Console.ReadLine();

                CatchConsoleCommand(command.ToUpper());
            } while (!_exitCommands.Contains(command.ToUpper()));

            NeutralComputerTalk(_exitQuips[_randomObject.Next(0, _exitQuips.Length)]);
        }

        public static void CatchConsoleCommand(string incomingCommand)
        {
            if (incomingCommand == nameof(Generate).ToUpper())
            {
                NeutralComputerTalk("How many histograms? (Please Write number):");
                string input = Console.ReadLine();
                int repeatAmount = -1;

                //Parsing input
                do
                {
                    try
                    {
                        repeatAmount = int.Parse(input);
                        
                    }
                    catch (Exception ex)
                    {
                        ErrorComputerTalk("Exception Caught, please try again. If not, then type in 0");
                        ErrorComputerTalk($"{ex.Message}");
                    }

                    if (repeatAmount < -1)
                    {
                        repeatAmount = -1;
                        ErrorComputerTalk("Exception Caught, please try again. If not, then type in 0");
                        NeutralComputerTalk($"Please type a number between 0 or greater");
                    }

                } while (repeatAmount < 0);

                for(int i = 0; i < repeatAmount; i++)
                {
                    NeutralComputerTalk($"{i} out of {repeatAmount} done");
                    Generate();
                }


                GoodComputerTalk("GenerationComplete");
            }
            else if (incomingCommand == nameof(RefreshData).ToUpper())
            {
                ErrorComputerTalk("This is a big ask. You are deleting training data. Are you sure? (YES if sure):");
                string response = Console.ReadLine();
                if (response.ToUpper() == "YES")
                {
                    NeutralComputerTalk("Ok then...");
                    RefreshData();
                    GoodComputerTalk("Refresh done. Old data deleted. Data Directory freshed.");
                }
                else
                {
                    GoodComputerTalk("Data not deleted (whew)...");
                }
            }
            else if (incomingCommand == nameof(GenerateExample).ToUpper())
            {
                GoodComputerTalk("Ooh, doing a demonstration? How exciting!");
                NeutralComputerTalk("Commencing example generation...");
                GenerateExample();
                GoodComputerTalk("Generation Complete!");
            }
            else if (incomingCommand == nameof(Help).ToUpper() || incomingCommand == "?")
            {
                Help();
            }
            else
            {
                if (!_exitCommands.Contains(incomingCommand.ToUpper()))
                    NeutralComputerTalk("I couldn't here you.");
            }
            
        }

        public static void Generate()
        {
            BitmapSubSection newBitmapSubsection =
                TemplateRandomizer.GenerateRandomBitmapSubsectionFromTemplate(FileGrabbers.GetImageTemplatePathsAndNames());

            HistogramConverter.ConvertAndSaveAllHistograms(
                newBitmapSubsection.BitmapSection,
                newBitmapSubsection.BitmapName);
        }

        public static void GenerateExample()
        {
            BitmapSubSection newBitmapSubsection =
                TemplateRandomizer.GenerateRandomBitmapSubsectionFromTemplate(
                    FileGrabbers.GetImageTemplatePathsAndNames());

            ImageFileHandler.WritePNGImage(
                newBitmapSubsection.BitmapSection,
                DataConfigHandler.AlteredDataConfigContent.RawTrainingImagesPath,
                newBitmapSubsection.BitmapName);
        }

        public static void RefreshData()
        {
            DataConfigHandler.DeleteData();
            DataConfigHandler.GenerateDataConfigFileAndDirectories();
        }

        public static void Help()
        {
            NeutralComputerTalk("Here are the commands I've been programmed with...");
            GoodComputerTalk(nameof(Generate));
            GoodComputerTalk(nameof(GenerateExample));
            GoodComputerTalk(nameof(RefreshData));
            GoodComputerTalk(nameof(Help));
            GoodComputerTalk("");

            ErrorComputerTalk("These are to leave if you wish to...");
            for(int i = 0; i < _exitCommands.Length; i++)
            {
                NeutralComputerTalk(_exitCommands[i]);
            }
        }

        public static void NeutralComputerTalk(string whatComputerIsSaying = "")
        {
            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.WriteLine(whatComputerIsSaying);
            Console.ResetColor();
        }

        public static void ErrorComputerTalk(string whatComputerIsSaying = "")
        {
            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine(whatComputerIsSaying);
            Console.ResetColor();
        }

        public static void GoodComputerTalk(string whatComputerIsSaying = "")
        {
            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine(whatComputerIsSaying);
            Console.ResetColor();
        }
    }
}
