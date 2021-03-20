using CognitiveServicesDemo.TextToSpeech.Models;
using CognitiveServicesDemo.TextToSpeech.Repositories;
using Microsoft.CognitiveServices.Speech;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace CognitiveServicesDemo.TextToSpeech.Services
{
    public class TextToSpeechService
    {
        private readonly ILogger<TextToSpeechService> _logger;
        private readonly SpeechServiceOptions _options;
        private readonly BlobStorageRepository _blobStorageRepository;
        //private TextToSpeechClient _client;

        public TextToSpeechService(ILogger<TextToSpeechService> logger, SpeechServiceOptions options, BlobStorageRepository blobStorageRepository)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _options = options ?? throw new ArgumentNullException(nameof(options));
            _blobStorageRepository = blobStorageRepository ?? throw new ArgumentNullException(nameof(blobStorageRepository));
        }

        public async Task<string> SynthesisToFileAsync(string text)
        {
            string audioUrl = null;
            // TODO: Initialize the client only once
            var config = SpeechConfig.FromSubscription(_options.ApiKey, _options.Region);

            // Creates a speech synthesizer using the default speaker as audio output.
            using (var synthesizer = new SpeechSynthesizer(config))
            {
                using (var result = await synthesizer.SpeakTextAsync(text))
                {
                    if (result.Reason == ResultReason.SynthesizingAudioCompleted)
                    {
                        _logger.LogInformation($"Speech synthesis completed for text [{text}]");
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
            }

            if (string.IsNullOrEmpty(audioUrl))
            {
                throw new Exception("Couldn't synthetise the text.");
            }

            return audioUrl;
        }
    }
}
