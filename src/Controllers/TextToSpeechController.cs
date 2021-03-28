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
        public async Task<IActionResult> Post(TextToSpeechRequest request)
        {
            if (string.IsNullOrEmpty(request.Text))
            {
                return BadRequest("Text is required");
            }

            if (string.IsNullOrEmpty(request.TargetLanguage))
            {
                return BadRequest("TargetLanguage is required");
            }

            if (string.IsNullOrEmpty(request.VoiceName))
            {
                return BadRequest("VoiceName is required");
            }

            try
            {
                // Translate input text
                var translationResult = await _translatorService.Translate(request.Text, request.TargetLanguage);
                var translatedText = translationResult.Translations.FirstOrDefault().Text;

                // Send to speech service
                var result = await _textToSpeechService.SynthesisToFileAsync(translatedText, request.VoiceName, request.TargetLanguage);

                return Ok(result);
            }
            catch (Exception e)
            {
                _logger.LogError("Error generating audio", e);
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }

        }
    }
}
