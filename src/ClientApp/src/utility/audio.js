export const processAudioFile = async (uri) =>
  new Promise((resolve, reject) => {
    var audioElement = document.createElement("audio");
    audioElement.src = uri;
    audioElement.addEventListener(
      "loadedmetadata",
      () => {
        var duration = audioElement.duration;
        resolve({
          audioElement,
          duration,
        });
      },
      false
    );
  });
