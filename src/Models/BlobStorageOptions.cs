using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CognitiveServicesDemo.TextToSpeech.Models
{
    public class BlobStorageOptions
    {
        public const string BlobStorage = "BlobStorage";

        public string ConnectionString { get; set; }

        public string ContainerName { get; set; }
    }
}
