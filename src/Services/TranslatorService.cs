using CognitiveServicesDemo.TextToSpeech.Models;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace CognitiveServicesDemo.TextToSpeech.Services
{
    public class TranslatorService
    {
        private const string Route = "/translate?api-version=3.0";
        private readonly ILogger<TranslatorService> _logger;
        private readonly TranslatorOptions _options;
        private readonly IHttpClientFactory _clientFactory;

        public TranslatorService(ILogger<TranslatorService> logger, IHttpClientFactory clientFactory, TranslatorOptions options)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _options = options ?? throw new ArgumentNullException(nameof(options));
            _clientFactory = clientFactory ?? throw new ArgumentNullException(nameof(clientFactory));
        }

        public async Task<TranslationResult> Translate(string text, string targetLanguage)
        {
            var body = new object[] { new { Text = text } };
            var requestBody = JsonConvert.SerializeObject(body);

            var client = _clientFactory.CreateClient();
            using (var request = new HttpRequestMessage())
            {
                // Build the request.
                request.Method = HttpMethod.Post;

                // For a complete list of options, see API reference.
                // https://docs.microsoft.com/azure/cognitive-services/translator/reference/v3-0-translate
                request.RequestUri = new Uri(_options.Endpoint + Route + $"&to={targetLanguage}");
                request.Content = new StringContent(requestBody, Encoding.UTF8, "application/json");
                request.Headers.Add("Ocp-Apim-Subscription-Key", _options.ApiKey);
                request.Headers.Add("Ocp-Apim-Subscription-Region", _options.Region);

                // Send the request and get response.
                var response = await client.SendAsync(request);

                // Read response as a string.
                var result = await response.Content.ReadAsStringAsync();
                var translationResults = JsonConvert.DeserializeObject<TranslationResult[]>(result);

                //TODO: The service should already return the highest score first, check
                return translationResults.OrderByDescending(x => x.DetectedLanguage.Score).FirstOrDefault();
            }
        }
    }
}
