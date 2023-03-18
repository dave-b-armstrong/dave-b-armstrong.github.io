importScripts("pixelTools.js");

self.onmessage = function (e) {
  //local copy of colors, to be passed and merged
  var localColors = e.data.colors;

  var beaddata = e.data.data;
  processBeads(beaddata, localColors);
  self.postMessage({
    result: beaddata,
    index: e.data.index,
    localColors: localColors,
  });
};
