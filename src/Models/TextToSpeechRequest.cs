using System;

namespace CognitiveServicesDemo.TextToSpeech.Models
{
    public class TextToSpeechRequest
    {
        public string Text { get; set; }

        public string FromLanguage { get; set; }

        public string ToLanguage { get; set; }
    }
}
