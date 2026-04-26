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
          backgroundColor: "#050507",
          color: "#f7f2ea",
          padding: 72,
          fontFamily: "Arial, sans-serif"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#f5dfb2",
            fontSize: 24
          }}
        >
          <span>Portfolio Premium 2026</span>
          <span>Luxury Digital</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <h1
            style={{
              margin: 0,
              maxWidth: 980,
              fontSize: 104,
              lineHeight: 0.94,
              fontWeight: 700
            }}
          >
            Senior Creative Developer
          </h1>
          <p
            style={{
              margin: 0,
              maxWidth: 820,
              color: "#a7a29a",
              fontSize: 34,
              lineHeight: 1.35
            }}
          >
            Interfaces sombres, projets dynamiques, espace client Neon et
            direction digitale haut de gamme.
          </p>
        </div>
      </div>
    ),
    size
  );
}
