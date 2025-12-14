const Lines = ({ children, y = 0 }) => {
  const lines = Array.isArray(children) ? children : [children];
  return (
    lines.length > 0 &&
    lines.map((line, index) => (
      <tspan key={index} x="0" y={index === 0 ? "0" : `${y * index}`}>
        {line}
      </tspan>
    ))
  );
};

export default Lines;
