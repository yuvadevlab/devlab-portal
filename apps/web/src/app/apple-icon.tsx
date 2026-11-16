/**
 * @file apps/web/src/app/apple-icon.tsx
 * @description Dynamic Apple Touch Icon for DevLab Portal.
 * @module @devlab/portal-web/app
 */

import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

/**
 * Generates Apple Touch Icon for mobile home screens using exact Lucide Layers icon with portal primary #5ed8a9.
 */
export default function Icon(): ImageResponse {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#090d16",
        borderRadius: "36px",
        border: "2px solid rgba(94, 216, 169, 0.4)",
      }}
    >
      <svg
        width="108"
        height="108"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#5ed8a9"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"
          fill="rgba(94, 216, 169, 0.25)"
        />
        <path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12" />
        <path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17" />
      </svg>
    </div>,
    {
      ...size,
    },
  );
}
