export const processAudioFile = async (uri) =>
  new Promise((resolve, reject) => {
    var audioElement = document.createElement("audio");
    audioElement.src = uri;
    audioElement.addEventListener(
      "loadedmetadata",
      () => {
        console.log("Metadata loaded " + uri);
        var duration = audioElement.duration;
        resolve({
          audioElement,
          duration,
        });
      },
      {
        once: true,
      }
    );
    audioElement.onerror = () => {
      reject(`Failed to load audio ${uri}`);
    };
  });
