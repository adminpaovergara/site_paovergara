import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#111111",
          color: "#f7f4ef",
          display: "flex",
          fontFamily: "Arial, sans-serif",
          fontSize: 26,
          fontWeight: 700,
          height: "100%",
          justifyContent: "center",
          letterSpacing: "-1px",
          width: "100%"
        }}
      >
        PV
      </div>
    ),
    size
  );
}
