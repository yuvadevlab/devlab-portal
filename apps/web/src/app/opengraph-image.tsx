/**
 * @file apps/web/src/app/opengraph-image.tsx
 * @description Dynamic Open Graph and Twitter preview image generator for DevLab Portal.
 * @module @devlab/portal-web/app
 */

import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "DevLab Portal — Ecosystem Control Plane";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

/**
 * Generates dynamic 1200x630 social card for link previews across WhatsApp, Twitter, Slack, and Google.
 */
export default function OpenGraphImage(): ImageResponse {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "60px 80px",
        background: "linear-gradient(135deg, #090d16 0%, #0f172a 50%, #020617 100%)",
        position: "relative",
        fontFamily: "system-ui, -apple-system, sans-serif",
        color: "#ffffff",
      }}
    >
      {/* Ambient Glow Orbs */}
      <div
        style={{
          position: "absolute",
          top: "-100px",
          right: "-100px",
          width: "500px",
          height: "500px",
          borderRadius: "250px",
          background: "radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-150px",
          left: "-150px",
          width: "600px",
          height: "600px",
          borderRadius: "300px",
          background: "radial-gradient(circle, rgba(56, 189, 248, 0.25) 0%, transparent 70%)",
        }}
      />

      {/* Top Header / Brand Badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #5ed8a9 0%, #0f766e 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 24px rgba(94, 216, 169, 0.4)",
            }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z" />
              <path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12" />
              <path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17" />
            </svg>
          </div>
          <span
            style={{
              fontSize: "26px",
              fontWeight: 700,
              letterSpacing: "-0.5px",
              color: "#f8fafc",
            }}
          >
            Yuva DevLab
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "8px 18px",
            borderRadius: "9999px",
            background: "rgba(99, 102, 241, 0.15)",
            border: "1px solid rgba(99, 102, 241, 0.4)",
            fontSize: "14px",
            fontWeight: 600,
            color: "#a5b4fc",
            letterSpacing: "0.5px",
          }}
        >
          CONTROL PLANE
        </div>
      </div>

      {/* Center Hero Information */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: "20px",
          zIndex: 10,
          maxWidth: "920px",
        }}
      >
        <h1
          style={{
            fontSize: "64px",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-1.5px",
            background: "linear-gradient(to bottom, #ffffff 40%, #cbd5e1 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            margin: 0,
          }}
        >
          DevLab Portal
        </h1>

        <p
          style={{
            fontSize: "24px",
            lineHeight: 1.4,
            color: "#94a3b8",
            margin: 0,
            maxWidth: "760px",
          }}
        >
          Unified Single Sign-On, IAM administration, and application control plane for the DevLab
          ecosystem.
        </p>

        {/* Feature Pills */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            marginTop: "12px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              borderRadius: "12px",
              background: "rgba(15, 23, 42, 0.8)",
              border: "1px solid rgba(148, 163, 184, 0.2)",
              fontSize: "16px",
              fontWeight: 600,
              color: "#e2e8f0",
            }}
          >
            <span>🔒 Centralized SSO</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              borderRadius: "12px",
              background: "rgba(15, 23, 42, 0.8)",
              border: "1px solid rgba(148, 163, 184, 0.2)",
              fontSize: "16px",
              fontWeight: 600,
              color: "#e2e8f0",
            }}
          >
            <span>⚡ Zero-Trust IAM</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              borderRadius: "12px",
              background: "rgba(15, 23, 42, 0.8)",
              border: "1px solid rgba(148, 163, 184, 0.2)",
              fontSize: "16px",
              fontWeight: 600,
              color: "#e2e8f0",
            }}
          >
            <span>🌐 Ecosystem Mesh</span>
          </div>
        </div>
      </div>

      {/* Footer info */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          fontSize: "15px",
          color: "#64748b",
          borderTop: "1px solid rgba(148, 163, 184, 0.15)",
          paddingTop: "24px",
          zIndex: 10,
        }}
      >
        <span>Ecosystem Control Plane • DevLab Portal</span>
        <span>yuva.devlab@gmail.com</span>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
