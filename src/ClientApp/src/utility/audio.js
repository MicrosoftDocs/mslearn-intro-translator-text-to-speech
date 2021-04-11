const getAudioFileLength = async () =>
  new Promise((resolve, reject) => {
    var audio = document.createElement("audio");

    // Add a change event listener to the file input
    document.getElementById("fileinput").addEventListener(
      "change",
      function (event) {
        var target = event.currentTarget;
        var file = target.files[0];
        let reader = new FileReader();

        if (target.files && file) {
          reader = new FileReader();

          reader.onload = function (e) {
            audio.src = e.target.result;
            audio.addEventListener(
              "loadedmetadata",
              function () {
                var duration = audio.duration;
                resolve(audio);
              },
              false
            );
          };

          reader.readAsDataURL(file);
        }
      },
      false
    );
  });
