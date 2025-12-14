import Lines from "./Lines";

const MobileText = ({ title = [], description = [] }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 347.06 257"
      style={{ width: "100%", height: "auto" }}
      preserveAspectRatio="xMidYMid meet"
    >
      <g>
        <polygon
          points="145.5 240.53 295.5 256.5 274.5 0.5 0.5 0.5 0.5 233.46 145.5 249.55 145.5 240.53"
          fill="#fff"
          stroke="#1a1a1a"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <text
          transform="translate(30.18 50.1)"
          fontSize="28"
          fontFamily="NotoSansCJKtc-Bold-B5pc-H, Noto Sans CJK TC"
          fontWeight="bold"
          letterSpacing="0.12em"
        >
          <Lines y={36}>{title}</Lines>
        </text>
        <text
          transform="translate(29 153.84)"
          fontSize="14"
          fontFamily="NotoSansCJKtc-Bold-B5pc-H, Noto Sans CJK TC"
          fontWeight="bold"
          letterSpacing="0.03em"
        >
          <Lines y={22}>{description}</Lines>
        </text>
      </g>
    </svg>
  );
};

export default MobileText;
