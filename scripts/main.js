(function () {
  'use strict';
  var w = 40,
    h = 30,
    network = new Network(3 * w * h, [200, 150, 200, 3 * w * h], function (x) {
      return 1 / (1 + Math.exp(-x));
    }, function (x) {
      return Math.exp(x) / Math.pow(1 + Math.exp(x), 2);
    }, 0.01),
    input = document.getElementById('input'),
    output = document.getElementById('output');
  [input.width, input.height] = [w, h];
  [output.width, output.height] = [w, h];
  function fromImageData(imageData) {
    return Array.from(imageData.data)
      .filter(function (v, i) { return (i + 1) % 4; })
      .map(function (x) { return x / 255; });
  }
  function toImageData(array) {
    var data = [];
    array.forEach(function (v, i) {
      data.push(255 * v);
      if (!((i + 1) % 3)) { data.push(255); }
    });
    return new ImageData(new Uint8ClampedArray(data), w, h);
  }
  navigator.mozGetUserMedia({video: true}, function (stream) {
    var video = document.createElement('video'),
      inputArray;
    video.autoplay = true;
    video.mozSrcObject = stream;
    setInterval(function () {
      if (!video.videoWidth) { return; }
      var context = input.getContext('2d');
      context.drawImage(video, 0, 0, w, h);
      inputArray = fromImageData(context.getImageData(0, 0, w, h));
      output.getContext('2d').putImageData(toImageData(
        network.predict(inputArray)
      ), 0, 0);
      if (Math.random() > 0.6) {
        network.train(inputArray, inputArray);
      }
    }, 150);
  }, function (error) { console.log(error); });
}());
