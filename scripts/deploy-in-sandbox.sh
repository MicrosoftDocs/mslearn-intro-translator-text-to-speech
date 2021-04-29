# Define the zip file we are going to deploy for this module
sourceZip=https://cognitiveserviceshowcase.blob.core.windows.net/build-artifacts/TranslatorTextToSpeech.zip

# Get the zip file
curl $sourceZip --output source.zip

# Get and set the subscription and RG
subscription=$(az account list --query [0].id -o tsv)
resourceGroupName=$(az group list --query "[0] | name" -o tsv)

# Create appservice plan
appServiceName=translator-text-to-speech-$RANDOM
az appservice plan create --name $appServiceName --resource-group $resourceGroupName --sku FREE

az cognitiveservices account create \
    --name cognitive-services-account-resource-text \
    --resource-group $resourceGroupName \
    --kind TextTranslation \
    --sku S1 \
    --location westus2 \
    --subscription $subscription\
    --yes

az cognitiveservices account create \
    --name cognitive-services-account-resource-speech \
    --resource-group $resourceGroupName \
    --kind SpeechServices \
    --sku S0 \
    --location westus2 \
    --subscription $subscription\
    --yes

apiKeyText=$(az cognitiveservices account keys list -g $resourceGroupName -n cognitive-services-account-resource-text --query [key1] -o tsv)
apiKeySpeech=$(az cognitiveservices account keys list -g $resourceGroupName -n cognitive-services-account-resource-speech --query [key1] -o tsv)
endpointText=https://api.cognitive.microsofttranslator.com/
endpointSpeech=https://westus2.api.cognitive.microsoft.com/sts/

# Create blob
blobName=blobtts$RANDOM
az storage account create \
    --name $blobName \
    --resource-group $resourceGroupName \
    --location westus2 \
    --sku Standard_ZRS \

# Create container
blobContainerName=ttsblob$RANDOM
# blobConnectionString=ttsconn$RANDOM
blobConnectionString=$(az storage account show-connection-string -g $resourceGroupName -n $blobName --query "connectionString" -o tsv)
az storage container create \
    --name $blobContainerName \
    --public-access blob \
    --connection-string $blobConnectionString

# create the webapp
webAppName=translator-text-to-speech-$RANDOM
az webapp create \
    --resource-group $resourceGroupName \
    --plan $appServiceName \
    --name $webAppName

# add the appsettings to the webapp
az webapp config appsettings set \
    --resource-group $resourceGroupName \
    --name $webAppName \
    --settings SpeechService:Endpoint=$endpointSpeech SpeechService:ApiKey=$apiKeySpeech SpeechService:Region=westus2 Translator:ApiKey=$apiKeyText Translator:Region=westus2 BlobStorage:ConnectionString=$blobConnectionString BlobStorage:ContainerName=$blobContainerName

# deploy to webapp
az webapp deployment source config-zip \
    --resource-group $resourceGroupName \
    --name $webAppName \
    --src source.zip

echo "Select the hyperlink below to see Translator and Text-to-speech in action"
echo https://$webAppName.azurewebsites.net

### ------------ OLD BELOW HERE FOR REFERENCE
# Create Azure Cogntive Services account and put key and endpoint into variables
: ' az cognitiveservices account create \
    --name cognitive-services-account-resource \
    --resource-group $resourceGroupName \
    --kind FormRecognizer \
    --sku S0 \
    --location westus2 \
    --subscription $subscription\
    --yes
apiKey=$(az cognitiveservices account keys list -g $resourceGroupName -n cognitive-services-account-resource --query [key1] -o tsv)
endpoint=https://westus2.api.cognitive.microsoft.com/

# create the webapp
webAppName=translator-text-to-speech-$RANDOM
az webapp create \
    --resource-group $resourceGroupName \
    --plan $appServiceName \
    --name $webAppName

# add the appsettings to the webapp
az webapp config appsettings set \
    --resource-group $resourceGroupName \
    --name $webAppName \
    --settings SpeechService:Endpoint=$endpoint FormRecognizer:ApiKey=$apiKey

# deploy to webapp
az webapp deployment source config-zip \
    --resource-group $resourceGroupName \
    --name $webAppName \
    --src source.zip

echo https://$webAppName.azurewebsites.net
echo "Select the hyperlink above to see Form Recognizer in action"'
