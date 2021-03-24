using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace CognitiveServicesDemo.TextToSpeech.Models
{
    /// <summary>
    /// Catalog of neural voices per language code used for the demo.
    /// The full list of supported neural voices can be found here:
    /// https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/language-support#neural-voices
    /// </summary>
    public class VoicesCatalog
    {
        public static readonly ReadOnlyDictionary<CultureInfo, string> NeuralVoicesPerLanguage = new ReadOnlyDictionary<CultureInfo, string>(
            new Dictionary<CultureInfo, string>()
            {
                { new CultureInfo("es-MX"), "es-MX-JorgeNeural" },
                { new CultureInfo("en-US"), "en-US-JennyNeural" }
            }
        );

        public string GetLocalFromVoice(string voiceName)
        {
            return voiceName.Substring(0, 5);
        }
    }
}
