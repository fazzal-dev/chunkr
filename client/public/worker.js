let fileChunks = [];
let fileName = "";
let fileType = "";
let fileSize = 0;

self.onmessage = function (e) {
  if (e.data.type === "fileInfo") {
    fileChunks = [];
    fileName = e.data.fileName;
    fileType = e.data.fileType;
    fileSize = e.data.fileSize;
  } else if (e.data.type === "done") {
    self.postMessage({
      type: "fileComplete",
      chunks: fileChunks,
      fileName: fileName,
      fileType: fileType,
    });
    fileChunks = [];
  } else {
    fileChunks.push(e.data);
  }
};
