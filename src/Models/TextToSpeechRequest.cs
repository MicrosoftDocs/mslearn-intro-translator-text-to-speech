using System;

namespace CognitiveServicesDemo.TextToSpeech.Models
{
    public class TextToSpeechRequest
    {
        public string Text { get; set; }

        public string SourceLanguage { get; set; }

        public string TargetLanguage { get; set; }
    }
}
