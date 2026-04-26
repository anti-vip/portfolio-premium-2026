import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Portfolio Premium 2026";

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
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#050507",
          color: "#f7f2ea",
          fontSize: 84,
          fontWeight: 700,
          fontFamily: "Arial, sans-serif"
        }}
      >
        Portfolio Premium 2026
      </div>
    ),
    {
      width: 1200,
      height: 630
    }
  );
}
