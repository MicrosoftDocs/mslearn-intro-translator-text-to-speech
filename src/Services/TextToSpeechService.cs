using CognitiveServicesDemo.TextToSpeech.Models;
using CognitiveServicesDemo.TextToSpeech.Repositories;
using Microsoft.CognitiveServices.Speech;
using Microsoft.CognitiveServices.Speech.Audio;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;

namespace CognitiveServicesDemo.TextToSpeech.Services
{
    public class TextToSpeechService : IDisposable
    {
        private const string FileExtension = "wav";

        private static readonly string SSMLTemplate = Path.Combine(Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location), "Templates/ssml.xml");

        private readonly ILogger<TextToSpeechService> _logger;
        private readonly SpeechServiceOptions _options;
        private readonly BlobStorageRepository _blobStorageRepository;
        private SpeechSynthesizer _synthesizer;
        private AudioConfig _streamConfig;
        private AudioOutputStream _audioOutputStream;

        public TextToSpeechService(ILogger<TextToSpeechService> logger, IOptions<SpeechServiceOptions> options, BlobStorageRepository blobStorageRepository)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _options = options.Value ?? throw new ArgumentNullException(nameof(options));
            _blobStorageRepository = blobStorageRepository ?? throw new ArgumentNullException(nameof(blobStorageRepository));
        }

        public async Task SynthesizeToFileAsync(IList<TextToSpeechRequest> requests)
        {
            foreach (var request in requests)
            {
                try
                {
                    string audioUrl;
                    if (request.Options.Adjustments == null)
                    {
                        audioUrl = await SynthesisToFileAsync(request.TranslatedText, request.Options.VoiceName);
                    }
                    else
                    {
                        audioUrl = await SynthesizeSsmlToFileAsync(request.TranslatedText, request.Options);

                    }

                    request.TTSAudioUrl = audioUrl;
                }
                finally
                {
                    Dispose();
                }
            }
        }

        private async Task<string> SynthesizeSsmlToFileAsync(string text, SpeechTranslationOption options)
        {
            var synthesizer = GetSpeechSynthesizer(null);

            var ssmlTemplate = await File.ReadAllTextAsync(SSMLTemplate);
            var ssml = string.Format(
                ssmlTemplate,
                options.VoiceName,
                options.Adjustments.Style,
                options.Adjustments.StyleDegree,
                options.Adjustments.Rate,
                options.Adjustments.Pitch,
                text);

            using var result = await synthesizer.SpeakSsmlAsync(ssml);
            var audioUrl = await ProcessSynthesisResult(text, result);

            if (string.IsNullOrEmpty(audioUrl))
            {
                throw new Exception("Couldn't synthesize the text.");
            }

            return audioUrl;


        }

        private async Task<string> SynthesisToFileAsync(string text, string voiceName)
        {
            string audioUrl = null;

            var synthesizer = GetSpeechSynthesizer(voiceName);
            using var result = await synthesizer.SpeakTextAsync(text);
            audioUrl = await ProcessSynthesisResult(text, result);

            if (string.IsNullOrEmpty(audioUrl))
            {
                throw new Exception("Couldn't synthesize the text.");
            }

            return audioUrl;
        }

        private async Task<string> ProcessSynthesisResult(string text, SpeechSynthesisResult result)
        {
            string audioUrl = null;

            switch (result.Reason)
            {
                case ResultReason.SynthesizingAudioCompleted:
                {
                    _logger.LogInformation($"Speech synthesis completed for text [{text}], and the audio was written to output stream");
                    var fileName = $"{Guid.NewGuid().ToString()}.{FileExtension}";
                    audioUrl = await _blobStorageRepository.UploadFileContent(result.AudioData, fileName);
                    break;
                }
                case ResultReason.Canceled:
                {
                    var cancellation = SpeechSynthesisCancellationDetails.FromResult(result);

                    if (cancellation.Reason == CancellationReason.Error)
                    {
                        throw new Exception($"Request Cancelled: ErrorCode={cancellation.ErrorCode}. ErrorDetails=[{cancellation.ErrorDetails}]");
                    }

                    break;
                }
                default:
                    throw new Exception($"Received unexpected result: Reason={result.Reason}.");
            }

            return audioUrl;
        }

        private SpeechSynthesizer GetSpeechSynthesizer(string voice)
        {
            var config = SpeechConfig.FromSubscription(_options.ApiKey, _options.Region);

            // Specify voice
            if (!string.IsNullOrWhiteSpace(voice))
            {
                config.SpeechSynthesisVoiceName = voice;
            }

            // Creates an audio output stream.
            _audioOutputStream = AudioOutputStream.CreatePullStream();
            _streamConfig = AudioConfig.FromStreamOutput(_audioOutputStream);

            // Creates a speech synthesizer, reuse this instance in real world applications to reduce number of connections
            _synthesizer = new SpeechSynthesizer(config, _streamConfig);

            return _synthesizer;
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
    }
}
