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

# Create Azure Cogntive Services account and put key and endpoint into variables
az cognitiveservices account create \
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
echo "Select the hyperlink above to see Form Recognizer in action"
