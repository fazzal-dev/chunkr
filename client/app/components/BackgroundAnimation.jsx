import { useMemo } from "react";

const BackgroundAnimation = () => {
  const backgroundElements = useMemo(() => {
    return [...Array(20)].map((_, i) => (
      <div
        key={i}
        className="data-chunk"
        style={{
          "--size": `${Math.random() * 100 + 50}`,
          "--x": `${Math.random() * 100}`,
          "--y": `${Math.random() * 100}`,
          "--delay": `${Math.random() * -15}s`,
        }}
      >
        {[...Array(4)].map((_, j) => (
          <div key={j} className="data-fragment" />
        ))}
      </div>
    ));
  }, []);

  return <div className="background-animation">{backgroundElements}</div>;
};

export default BackgroundAnimation;
