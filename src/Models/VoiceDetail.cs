using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CognitiveServicesDemo.TextToSpeech.Models
{
    public class VoiceDetail
    {
        public string VoiceShortName { get; set; }

        public string DisplayName { get; set; }

        public string VoiceType { get; set; }

        public bool IsStyleDegreeSupported { get; set; }

        public IList<StyleInfo> Styles { get; set; }

        public IList<RoleInfo> Roles { get; set; }

        public IList<string> PitchOptions { get; set; }

        public IList<string> RateOptions { get; set; }
    }

    public class StyleInfo
    {
        public string StyleName { get; set; }

        public string DisplayName { get; set; }
    }

    public class RoleInfo
    {
        public string RoleName { get; set; }

        public string DisplayName { get; set; }
    }
}
