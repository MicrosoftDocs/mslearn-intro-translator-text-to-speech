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

        public TextToSpeechController(ILogger<TextToSpeechController> logger, TextToSpeechService textToSpeechService)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _textToSpeechService = textToSpeechService ?? throw new ArgumentNullException(nameof(textToSpeechService));
        }

        [HttpPost("synthesizer")]
        public async Task<IActionResult> Post(TextToSpeechRequest request)
        {
            if (string.IsNullOrEmpty(request.Text))
            {
                return BadRequest("Text is required");
            }

            if (string.IsNullOrEmpty(request.SourceLanguage))
            {
                return BadRequest("FromLanguage is required");
            }

            if (string.IsNullOrEmpty(request.TargetLanguage))
            {
                return BadRequest("ToLanguage is required");
            }

            try
            {
                var result = await _textToSpeechService.SynthesisToFileAsync(request.Text);
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
