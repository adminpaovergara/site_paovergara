import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#f7f4ef",
          border: "12px solid #111111",
          color: "#111111",
          display: "flex",
          fontFamily: "Arial, sans-serif",
          fontSize: 64,
          fontWeight: 700,
          height: "100%",
          justifyContent: "center",
          letterSpacing: "-3px",
          width: "100%"
        }}
      >
        PV
      </div>
    ),
    size
  );
}
