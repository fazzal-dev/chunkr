import {
  AiOutlineFile,
  AiOutlineCloudUpload,
  AiOutlineLoading3Quarters,
} from "react-icons/ai";

const FileUpload = ({ file, setFile, sendFile, uploadProgress, isSending }) => {
  const selectFile = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div className="space-y-6">
      <input
        onChange={selectFile}
        type="file"
        className="hidden"
        id="fileInput"
      />
      <label
        htmlFor="fileInput"
        className="block w-full text-lg py-3 px-6 rounded-xl border-2 border-blue-500
        text-center font-semibold cursor-pointer
        hover:bg-blue-500 hover:text-white transition-all duration-300 ease-in-out
        flex items-center justify-center"
      >
        <AiOutlineFile className="mr-2" size={24} />
        Choose File
      </label>
      {file && (
        <div className="bg-gray-700 p-4 rounded-xl flex items-center justify-between">
          <span className="truncate font-medium">{file.name}</span>
          {uploadProgress > 0 && (
            <div className="flex items-center">
              <AiOutlineLoading3Quarters className="animate-spin mr-2 text-blue-500" />
              <span className="text-blue-400 font-semibold">
                {uploadProgress}%
              </span>
            </div>
          )}
        </div>
      )}
      <button
        onClick={sendFile}
        disabled={!file || isSending}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 font-bold py-3 px-6 rounded-xl disabled:opacity-50 transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
      >
        <AiOutlineCloudUpload className="mr-2" size={24} />
        {isSending ? "Sending..." : "Send File"}
      </button>
    </div>
  );
};

export default FileUpload;
