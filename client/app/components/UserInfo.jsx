const UserInfo = ({ userName }) => {
  return (
    <div className="mb-12 flex items-center justify-center">
      <div className="relative">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg transform rotate-45">
          <span className="text-white text-3xl font-bold transform -rotate-45">
            {userName.charAt(0)}
          </span>
        </div>
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-700 px-4 py-1 rounded-full w-max text-center">
          <span className="text-sm font-medium">{userName}</span>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
