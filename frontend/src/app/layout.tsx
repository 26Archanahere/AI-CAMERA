import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VisionAI | Computer Vision Workspace",
  description: "A local-first computer vision workspace for object detection.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
