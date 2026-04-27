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
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 16,
          background: "#050507",
          color: "#f5dfb2",
          border: "1px solid rgba(245,223,178,0.42)",
          fontSize: 21,
          fontWeight: 700,
          fontFamily: "Inter, Arial, sans-serif"
        }}
      >
        AD
      </div>
    ),
    size
  );
}
