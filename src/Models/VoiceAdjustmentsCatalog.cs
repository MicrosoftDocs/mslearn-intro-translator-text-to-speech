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
    public class VoiceAdjustmentsCatalog
    {
        public static readonly IDictionary<string, string> StylesDisplayName = new Dictionary<string, string>()
        {
            { "customerservice", "Customer Service" },
            { "newscast", "News Cast" },
            { "newscast-formal", "News Cast (Formal)"},
            { "newscast-casual", "News Cast (Casual)"},
            { "narration-professional", "Narration (Professional)"}
        };

        public static readonly IDictionary<string, IList<string>> RolesPerVoice = new Dictionary<string, IList<string>>()
        {
            { "zh-CN-XiaomoNeural", new List<string> { "YoungAdultFemale", "OlderAdultMale", "Girl", "Boy" } },
            { "zh-CN-XiaoxuanNeural", new List<string> { "YoungAdultFemale", "OlderAdultFemale", "OlderAdultMale" } }
        };

        public static readonly IList<string> RateValues = new List<string> { "x-slow", "slow", "medium", "fast", "x-fast", "default" };

        public static readonly IList<string> PitchValues = new List<string> { "x-low", "low", "medium", "high", "x-high", "default" };

        public static readonly IList<string> StyleDegreeSupportedVoices = new List<string> { "zh-CN-XiaoxiaoNeural" };
    }
}
