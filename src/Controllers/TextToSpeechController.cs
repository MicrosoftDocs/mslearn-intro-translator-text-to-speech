using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using CognitiveServicesDemo.TextToSpeech.Models;
using CognitiveServicesDemo.TextToSpeech.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace CognitiveServicesDemo.TextToSpeech.Controllers
{
    [ApiController]
    [Route("speech")]
    public class TextToSpeechController : ControllerBase
    {
        private readonly ILogger<TextToSpeechController> _logger;
        private readonly TextToSpeechService _textToSpeechService;
        private readonly TranslatorService _translatorService;
        private readonly VoiceInformationService _voicesService;

        public TextToSpeechController(ILogger<TextToSpeechController> logger, TextToSpeechService textToSpeechService, TranslatorService translatorService, VoiceInformationService voicesService)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _textToSpeechService = textToSpeechService ?? throw new ArgumentNullException(nameof(textToSpeechService));
            _translatorService = translatorService ?? throw new ArgumentNullException(nameof(translatorService));
            _voicesService = voicesService ?? throw new ArgumentNullException(nameof(voicesService));
        }

        [HttpGet("locales")]
        public async Task<IActionResult> GetLocales()
        {
            var locales = await _voicesService.GetLocales();

            return Ok(locales);
        }

        [HttpGet("voices")]
        public async Task<IActionResult> GetVoices([FromQuery] string locale)
        {
            if (string.IsNullOrEmpty(locale))
            {
                return BadRequest("Locale is required");
            }

            var voices = await _voicesService.GetVoices(locale);

            return Ok(voices);
        }

        [HttpPost("synthesizer")]
        public async Task<IActionResult> Post(TranslateTextToSpeechRequest request)
        {
            var isValid = IsModelValid(request);

            try
            {
                // Translate input text
                var targetLanguages = request.SpeechTranslationOptions.Select(o => o.TargetLanguage).ToList();
                var translationResults = await _translatorService.Translate(request.Text, targetLanguages);

                var ttsRequests = translationResults.Translations
                    .Select(t => new TextToSpeechRequest
                    {
                        Options = request.SpeechTranslationOptions.FirstOrDefault(o => o.TargetLanguage == t.To),
                        TranslatedText = t.Text
                    }).ToList();

                // Send to speech service
                await _textToSpeechService.SynthesisToFileAsync(ttsRequests);

                return Ok(ttsRequests);
            }
            catch (Exception e)
            {
                _logger.LogError("Error generating audio", e);
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
        }

        private ActionResult IsModelValid(TranslateTextToSpeechRequest request)
        {
            if (string.IsNullOrEmpty(request.Text))
            {
                return BadRequest("Text is required");
            }

            foreach (var ttsRequest in request.SpeechTranslationOptions)
            {
                if (string.IsNullOrEmpty(ttsRequest.TargetLanguage))
                {
                    return BadRequest("TargetLanguage is required");
                }

                if (string.IsNullOrEmpty(ttsRequest.VoiceName))
                {
                    return BadRequest("VoiceName is required");
                }
            }
            
            return Ok();
        }
    }
}
