import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#f7f4ef",
          color: "#111111",
          display: "flex",
          flexDirection: "column",
          fontFamily: "Arial, sans-serif",
          height: "100%",
          justifyContent: "space-between",
          padding: "58px 64px",
          width: "100%"
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 24,
            fontWeight: 700,
            justifyContent: "space-between",
            letterSpacing: "7px",
            textTransform: "uppercase"
          }}
        >
          <span>Pao Vergara</span>
          <span>Color / Finishing</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 170,
              fontWeight: 800,
              letterSpacing: "-11px",
              lineHeight: 0.78,
              textTransform: "uppercase"
            }}
          >
            <span>PAO</span>
            <span>VERGARA</span>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              gap: 18,
              letterSpacing: "-0.5px",
              marginTop: 36
            }}
          >
            <span>Commercials</span>
            <span>/</span>
            <span>Fashion</span>
            <span>/</span>
            <span>Music</span>
            <span>/</span>
            <span>Fiction</span>
          </div>
        </div>
      </div>
    ),
    size
  );
}
