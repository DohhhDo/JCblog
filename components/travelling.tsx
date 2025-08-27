import React from "react";

const Icon = ({ width = "79.635", height = "67.46", ...other }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 79.635 67.46"
      {...other}
    >
      <defs>
        <style>
          {`.cls-1{fill:none;stroke:#fff;stroke-linecap:round;stroke-width:10px}`}
        </style>
      </defs>
      <g
        id="组_1"
        dataName="组 1"
        transform="translate(-109.428 -111.112)"
      >
        <path
          id="直线_1"
          dataName="直线 1"
          className="cls-1"
          transform="translate(114.5 172.5)"
          d="m0 0 69.159 1"
        />

        <path
          id="路径_2"
          dataName="路径 2"
          className="cls-1"
          d="M33.159 0S10.713-1.9-5.379 7.55s-25.833 30.264-25.833 30.264h64.371"
          transform="translate(150.5 116.192)"
        />
      </g>
    </svg>
  );
};
export default React.memo(Icon);
