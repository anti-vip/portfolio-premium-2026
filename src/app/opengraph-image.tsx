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
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#050507",
          color: "#f7f2ea",
          padding: 72,
          fontFamily: "Inter, Arial, sans-serif"
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 420,
            height: 420,
            background: "rgba(245,223,178,0.12)",
            borderRadius: 420
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: -40,
            width: 520,
            height: 260,
            background: "rgba(57,188,161,0.1)",
            borderRadius: 260
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#f5dfb2",
            fontSize: 24,
            letterSpacing: "0.16em",
            textTransform: "uppercase"
          }}
        >
          <span>ANTIDZN</span>
          <span>France / C4D</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <h1
            style={{
              margin: 0,
              maxWidth: 1040,
              fontSize: 104,
              lineHeight: 0.9,
              fontWeight: 700
            }}
          >
            Direction Artistique & Systèmes Visuels.
          </h1>
          <p
            style={{
              margin: 0,
              maxWidth: 820,
              color: "#a7a29a",
              fontSize: 32,
              lineHeight: 1.35
            }}
          >
            Identités à fort caractère. 3D, C4D et branding de communautés digitales.
          </p>
        </div>
      </div>
    ),
    size
  );
}
