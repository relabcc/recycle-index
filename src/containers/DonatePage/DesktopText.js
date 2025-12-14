import Lines from "./Lines";

const DesktopText = ({ title = [], description = [] }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 866.75 405.5"
      style={{ width: "100%", height: "auto" }}
      preserveAspectRatio="xMidYMid meet"
    >
      <g>
        <polygon
          points="773.03 123.07 485.83 0.75 492.99 60.36 0.75 14.94 129.96 404.75 644.5 404.75 618.58 374.24 800.75 375.3 773.03 123.07"
          fill="#fff"
          stroke="#1a1a1a"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />

        <text
          transform="translate(101.18 146.98)"
          fontSize="54"
          fontFamily="NotoSansCJKtc-Bold-B5pc-H, Noto Sans CJK TC"
          fontWeight="bold"
          letterSpacing="0.12em"
        >
          <Lines y={70}>{title}</Lines>
        </text>
        <text
          transform="translate(149.64 271.65)"
          fontSize="24"
          fontFamily="NotoSansCJKtc-Bold-B5pc-H, Noto Sans CJK TC"
          fontWeight="bold"
          letterSpacing="0.1em"
        >
          <Lines y={38}>{description}</Lines>
        </text>
      </g>
    </svg>
  );
};

export default DesktopText;
