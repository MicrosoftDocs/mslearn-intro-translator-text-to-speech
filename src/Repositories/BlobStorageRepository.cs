using Azure.Storage.Blobs;
using CognitiveServicesDemo.TextToSpeech.Models;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace CognitiveServicesDemo.TextToSpeech.Repositories
{
    public class BlobStorageRepository
    {
        private readonly ILogger<BlobStorageRepository> _logger;
        private readonly BlobStorageOptions _options;
        private BlobContainerClient _blobContainerClient;

        public BlobStorageRepository(ILogger<BlobStorageRepository> logger, BlobStorageOptions options)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _options = options ?? throw new ArgumentNullException(nameof(options));
        }

        public async Task<string> UploadFileContent(byte[] data, string fileName)
        {
            var client = GetContainerClient();
            using (var stream = new MemoryStream(data, writable: false))
            {
                var response = await client.UploadBlobAsync(fileName, stream);

                var blobUrl = $"{client.Uri.ToString()}/{fileName}";
                _logger.LogInformation($"Successfully uploaded file to {blobUrl}");

                return blobUrl;
            }
        }

        private BlobContainerClient GetContainerClient()
        {
            if (_blobContainerClient == null)
            {
                var blobServiceClient = new BlobServiceClient(_options.ConnectionString);

                // Create the container and return a container client object
                _blobContainerClient = blobServiceClient.GetBlobContainerClient(_options.ContainerName);
            }
            
            return _blobContainerClient;
        }
    }
}
