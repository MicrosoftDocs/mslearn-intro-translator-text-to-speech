using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CognitiveServicesDemo.TextToSpeech.Models
{
    public class TranslatorOptions
    {
        public const string Translator = "Translator";

        public string ApiKey { get; set; }

        public string Endpoint { get; set; }

        public string Region { get; set; }
    }
}
