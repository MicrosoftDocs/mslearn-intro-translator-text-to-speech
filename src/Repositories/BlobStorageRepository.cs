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
            _options = options ?? throw new ArgumentNullException(nameof(options));
        }

        public async Task<string> UploadFileContent(byte[] data)
        {
            var client = GetContainerClient();
            using (var stream = new MemoryStream(data, writable: false))
            {
                //TODO: Pass file name as parameter
                var blobName = $"{Guid.NewGuid().ToString()}.wav";
                var response = await client.UploadBlobAsync(blobName, stream);
                return $"{client.Uri.ToString()}/{blobName}";
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
