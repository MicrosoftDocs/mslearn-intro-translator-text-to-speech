using CognitiveServicesDemo.TextToSpeech.Models;
using CognitiveServicesDemo.TextToSpeech.Repositories;
using Microsoft.CognitiveServices.Speech;
using Microsoft.CognitiveServices.Speech.Audio;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace CognitiveServicesDemo.TextToSpeech.Services
{
    public class VoicesService : IDisposable
    {
        private readonly ILogger<TextToSpeechService> _logger;
        private readonly SpeechServiceOptions _options;
        private IReadOnlyCollection<VoiceInfo> _voices;
        private SpeechSynthesizer _synthesizer;

        public VoicesService(ILogger<TextToSpeechService> logger, SpeechServiceOptions options)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _options = options ?? throw new ArgumentNullException(nameof(options));
        }

        public async Task<List<string>> GetLocales()
        {
            var voices = await GetVoices();

            return voices
                .GroupBy(v => v.Locale)
                .Select(g => g.First().Locale)
                .ToList();
        }

        public async Task<List<string>> GetVoices(string locale)
        {
            var voices = await GetVoices();

            return voices
                .Where(v => v.Locale.Equals(locale, StringComparison.OrdinalIgnoreCase))
                .Select(v => v.ShortName)
                .ToList();
        }

        public async Task<bool> IsValidLanguage(string language)
        {
            var voices = await GetVoices();
            var match = voices.FirstOrDefault(x => x.Locale.StartsWith(language));
            return match != null;
        }

        private async Task<IReadOnlyCollection<VoiceInfo>> GetVoices()
        {
            if (_voices == null)
            {
                var synthesizer = GetSpeechSynthesizer();
                using (var result = await synthesizer.GetVoicesAsync())
                {
                    _voices = result.Voices;
                }
            }
            
            return _voices;
        }

        public void Dispose()
        {
            if (_synthesizer != null)
            {
                _synthesizer.Dispose();
            }
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
    }
}
