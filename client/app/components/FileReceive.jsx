import { AiOutlineCloudDownload } from "react-icons/ai";

const FileDownload = ({
  isReceivingFile,
  fileReceived,
  receivedFileName,
  downloadProgress,
  receivedFileBlob,
}) => {
  const download = () => {
    if (receivedFileBlob) {
      const url = URL.createObjectURL(receivedFileBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = receivedFileName;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  };

  if (!isReceivingFile && !fileReceived) return null;

  return (
    <div className="mt-8 bg-gray-700 p-6 rounded-xl shadow-md relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-blue-500"></div>
      <p className="font-semibold mb-3">Receiving: {receivedFileName}</p>
      <div className="flex items-center mt-2">
        <div className="flex-1 bg-gray-600 rounded-full h-3 mr-3">
          <div
            className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${downloadProgress}%` }}
          ></div>
        </div>
        <span className="text-sm font-medium">{downloadProgress}%</span>
      </div>
      {fileReceived && (
        <button
          onClick={download}
          className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 font-bold py-3 px-6 rounded-xl mt-4 transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
        >
          <AiOutlineCloudDownload className="mr-2" size={24} />
          Download
        </button>
      )}
    </div>
  );
};

export default FileDownload;
