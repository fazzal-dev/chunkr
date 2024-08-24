import { useMemo } from "react";

const BackgroundAnimation = () => {
  const backgroundElements = useMemo(() => {
    return [...Array(20)].map((_, i) => (
      <div
        key={i}
        className="absolute bg-blue-500 opacity-10 rounded-full"
        style={{
          width: `${Math.random() * 300 + 50}px`,
          height: `${Math.random() * 300 + 50}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animation: `float ${Math.random() * 10 + 5}s infinite ease-in-out`,
        }}
      ></div>
    ));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">{backgroundElements}</div>
  );
};

export default BackgroundAnimation;
