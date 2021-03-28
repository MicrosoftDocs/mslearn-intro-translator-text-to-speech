using CognitiveServicesDemo.TextToSpeech.Models;
using CognitiveServicesDemo.TextToSpeech.Repositories;
using Microsoft.CognitiveServices.Speech;
using Microsoft.CognitiveServices.Speech.Audio;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace CognitiveServicesDemo.TextToSpeech.Services
{
    public class VoiceInformationService : IDisposable
    {
        private readonly ILogger<TextToSpeechService> _logger;
        private readonly SpeechServiceOptions _options;
        private IReadOnlyCollection<VoiceInfo> _voices;
        private SpeechSynthesizer _synthesizer;

        public VoiceInformationService(ILogger<TextToSpeechService> logger, SpeechServiceOptions options)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _options = options ?? throw new ArgumentNullException(nameof(options));
        }

        public async Task<IList<LocaleInfo>> GetLocales()
        {
            var voices = await GetVoices();

            var locales = voices
                .GroupBy(v => v.Locale)
                .Select(g => g.First().Locale)
                .ToList();

            return locales.Select(l => new LocaleInfo(CultureInfo.GetCultureInfo(l))).ToList();
        }

        public async Task<IList<VoiceDetail>> GetVoices(string locale)
        {
            var voices = await GetVoices();

            var voicesPerLocale = voices.Where(v => v.Locale.Equals(locale, StringComparison.OrdinalIgnoreCase));
            _logger.LogInformation($"Found {voicesPerLocale.Count()} voices for locale {locale}");

            return voicesPerLocale
                .Select(v => new VoiceDetail
                {
                    VoiceShortName = v.ShortName,
                    VoiceType = Enum.GetName(typeof(SynthesisVoiceType), v.VoiceType),
                    DisplayName = GetVoiceDisplayName(v),
                    Styles = GetStyles(v.StyleList),
                    IsStyleDegreeSupported = VoiceAdjustmentsCatalog.StyleDegreeSupportedVoices.Contains(v.ShortName),
                    Roles = GetRoles(v.ShortName),
                    RateOptions = VoiceAdjustmentsCatalog.RateValues,
                    PitchOptions = VoiceAdjustmentsCatalog.PitchValues
                }).ToList();
        }

        public async Task<bool> IsValidLanguage(string language)
        {
            var voices = await GetVoices();
            var match = voices.FirstOrDefault(x => x.Locale.StartsWith(language));
            return match != null;
        }

        public void Dispose()
        {
            if (_synthesizer != null)
            {
                _synthesizer.Dispose();
            }
        }

        private async Task<IReadOnlyCollection<VoiceInfo>> GetVoices()
        {
            if (_voices == null)
            {
                var synthesizer = GetSpeechSynthesizer();
                using (var result = await synthesizer.GetVoicesAsync())
                {
                    _voices = result.Voices;

                    _logger.LogInformation($"Received {_voices.Count} from Speech Service");
                }
            }

            return _voices;
        }

        private SpeechSynthesizer GetSpeechSynthesizer()
        {
            if (_synthesizer == null)
            {
                var config = SpeechConfig.FromSubscription(_options.ApiKey, _options.Region);

                // Creates a default speech synthesizer
                _synthesizer = new SpeechSynthesizer(config);
            }

            return _synthesizer;
        }

        private string GetVoiceDisplayName(VoiceInfo voiceInfo)
        {
            var voiceName = voiceInfo.ShortName;
            var displayName = voiceName.Substring(voiceName.LastIndexOf("-") + 1);

            if (voiceInfo.VoiceType == SynthesisVoiceType.OnlineNeural || voiceInfo.VoiceType == SynthesisVoiceType.OfflineNeural)
            {
                displayName = displayName.Replace("Neural", " (Neural)");
            }

            return displayName;
        }

        private IList<RoleInfo> GetRoles(string voice)
        {
            if (string.IsNullOrEmpty(voice)) return new List<RoleInfo>();

            VoiceAdjustmentsCatalog.RolesPerVoice.TryGetValue(voice, out var roles);
            if (roles == null) return new List<RoleInfo>();

            return roles.Select(r => new RoleInfo
            {
                RoleName = r,
                DisplayName = GetRoleDisplayName(r)
            }).ToList();
        }

        private string GetRoleDisplayName(string value)
        {
            Regex r = new Regex("(?<=[a-z])(?<x>[A-Z])|(?<=.)(?<x>[A-Z])(?=[a-z])");
            return r.Replace(value.ToString(), " ${x}");
        }

        private IList<StyleInfo> GetStyles(string[] styleList)
        {
            if (!styleList.Any()) return new List<StyleInfo>();

            return styleList?.Where(s => !string.IsNullOrEmpty(s))
                .Select(s => new StyleInfo
                {
                    StyleName = s,
                    DisplayName = GetStyleDisplayName(s)
                }).ToList();
        }

        private string GetStyleDisplayName(string style)
        {
            VoiceAdjustmentsCatalog.StylesDisplayName.TryGetValue(style, out var displayName);

            return displayName ?? style.First().ToString().ToUpper() + style.Substring(1);
        }

    }
}
