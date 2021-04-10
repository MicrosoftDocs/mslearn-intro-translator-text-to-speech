using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CognitiveServicesDemo.TextToSpeech.Models
{
    public class TranslateTextToSpeechRequest
    {
        [Required]
        public string Text { get; set; }

        public IList<SpeechTranslationOption> SpeechTranslationOptions { get; set; }
    }

    public class SpeechTranslationOption
    {
        [Required]
        public string TargetLanguage { get; set; }

        [Required]
        public string VoiceName { get; set; }
    }

    public class TextToSpeechRequest
    {
        public SpeechTranslationOption Options { get; set; }

        public string TranslatedText { get; set; }

        public string TTSAudioUrl { get; set; }
    }
}
