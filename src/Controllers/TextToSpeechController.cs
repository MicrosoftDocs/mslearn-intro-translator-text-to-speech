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
        private readonly VoicesService _voicesService;

        public TextToSpeechController(ILogger<TextToSpeechController> logger, TextToSpeechService textToSpeechService, VoicesService voicesService)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _textToSpeechService = textToSpeechService ?? throw new ArgumentNullException(nameof(textToSpeechService));
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

            try
            {
                var result = await _textToSpeechService.SynthesisToFileAsync(request.Text, request.TargetLanguage);
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
