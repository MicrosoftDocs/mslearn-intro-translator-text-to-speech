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
    public class TextToSpeechService : IDisposable
    {
        private readonly ILogger<TextToSpeechService> _logger;
        private readonly SpeechServiceOptions _options;
        private readonly BlobStorageRepository _blobStorageRepository;
        private SpeechSynthesizer _synthesizer;
        private AudioConfig _streamConfig;
        private AudioOutputStream _audioOutputStream;

        public TextToSpeechService(ILogger<TextToSpeechService> logger, SpeechServiceOptions options, BlobStorageRepository blobStorageRepository)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _options = options ?? throw new ArgumentNullException(nameof(options));
            _blobStorageRepository = blobStorageRepository ?? throw new ArgumentNullException(nameof(blobStorageRepository));
        }

        public async Task<string> SynthesisToFileAsync(string text, string targetLanguage = LanguageCodes.English)
        {
            string audioUrl = null;

            var synthesizer = GetSpeechSynthesizer(targetLanguage);
            using (var result = await synthesizer.SpeakTextAsync(text))
            {
                if (result.Reason == ResultReason.SynthesizingAudioCompleted)
                {
                    _logger.LogInformation($"Speech synthesis completed for text [{text}], and the audio was written to output stream");
                    audioUrl = await _blobStorageRepository.UploadFileContent(result.AudioData);
                }
                else if (result.Reason == ResultReason.Canceled)
                {
                    var cancellation = SpeechSynthesisCancellationDetails.FromResult(result);

                    if (cancellation.Reason == CancellationReason.Error)
                    {
                        throw new Exception($"Request Cancelled: ErrorCode={cancellation.ErrorCode}. ErrorDetails=[{cancellation.ErrorDetails}]");
                    }
                }
                else
                {
                    throw new Exception($"Received unexpected result: Reason={result.Reason}.");
                }
            }

            if (string.IsNullOrEmpty(audioUrl))
            {
                throw new Exception("Couldn't synthetise the text.");
            }

            return audioUrl;
        }

        public void Dispose()
        {
            if (_synthesizer != null)
            {
                _synthesizer.Dispose();
                _audioOutputStream.Dispose();
                _streamConfig.Dispose();
            }
        }

        private SpeechSynthesizer GetSpeechSynthesizer(string language)
        {
            if (_synthesizer == null)
            {
                var config = SpeechConfig.FromSubscription(_options.ApiKey, _options.Region);

                // Specify voice and language
                var voice = VoicesCatalog.NeuralVoicesPerLanguage.FirstOrDefault(x => x.Key.TwoLetterISOLanguageName.Equals(language, StringComparison.OrdinalIgnoreCase));
                config.SpeechSynthesisVoiceName = voice.Value;
                config.SpeechSynthesisLanguage = voice.Key.Name;

                // Creates an audio output stream.
                _audioOutputStream = AudioOutputStream.CreatePullStream();
                _streamConfig = AudioConfig.FromStreamOutput(_audioOutputStream);

                // Creates a speech synthesizer, reuse this instance in real world applications to reduce number of connections
                _synthesizer = new SpeechSynthesizer(config, _streamConfig);
            }

            return _synthesizer;
        }
    }
}
