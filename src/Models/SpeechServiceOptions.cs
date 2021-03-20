using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CognitiveServicesDemo.TextToSpeech.Models
{
    public class SpeechServiceOptions
    {
        public const string SpeechService = "SpeechService";

        public string Region { get; set; }

        public string ApiKey { get; set; }
    }
}
