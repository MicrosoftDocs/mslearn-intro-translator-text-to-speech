using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace CognitiveServicesDemo.TextToSpeech.Models
{
    public class LocaleInfo
    {
        private readonly CultureInfo _cultureInfo;

        public LocaleInfo(CultureInfo cultureInfo)
        {
            _cultureInfo = cultureInfo;
        }

        public string Locale {
            get
            {
                return _cultureInfo.Name;
            }
        }

        public string DisplayName
        {
            get
            {
                return _cultureInfo.DisplayName;
            }
        }

        public string Language
        {
            get
            {
                return _cultureInfo.TwoLetterISOLanguageName;
            }
        }
    }
}
