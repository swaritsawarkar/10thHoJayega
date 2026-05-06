import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "10thHoJayega Class 10 syllabus tracker dashboard preview";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: "#fbf7ef",
        color: "#17130d",
        padding: "64px",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          border: "4px solid #17130d",
          borderRadius: "28px",
          padding: "48px",
          background: "#ffffff",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "32px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              fontSize: 34,
              fontWeight: 900,
            }}
          >
            <div
              style={{
                width: "88px",
                height: "88px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "20px",
                background: "#17130d",
                color: "#f8f1df",
                fontSize: 40,
                fontWeight: 900,
                border: "8px solid #f8f1df",
                boxShadow: "0 0 0 3px #17130d",
              }}
            >
              10
            </div>
            10thHoJayega
          </div>
          <div
            style={{
              border: "2px solid #2f6f56",
              color: "#1d5c43",
              borderRadius: "999px",
              padding: "14px 22px",
              fontSize: 24,
              fontWeight: 800,
            }}
          >
            CBSE + NCERT
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <div
            style={{
              fontSize: 78,
              lineHeight: 1,
              fontWeight: 900,
              letterSpacing: 0,
              maxWidth: "930px",
            }}
          >
            Class 10 syllabus. Sorted, tracked, printable.
          </div>
          <div
            style={{
              maxWidth: "830px",
              color: "#5f594f",
              fontSize: 32,
              lineHeight: 1.25,
              fontWeight: 700,
            }}
          >
            Progress tracking, Maths exercise status, focus mode, official
            textbook links, and clean study checklists.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "18px",
            fontSize: 24,
            fontWeight: 800,
            color: "#17130d",
          }}
        >
          {["Track", "Revise", "Print", "Finish"].map((item) => (
            <div
              key={item}
              style={{
                display: "flex",
                border: "2px solid #d9d1c1",
                borderRadius: "16px",
                padding: "14px 22px",
                background: "#fbf7ef",
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>,
    size,
  );
}
