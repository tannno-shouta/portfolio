"use client";

import dynamic from "next/dynamic";

const Scene = dynamic(
  () => import("./Scene").then((m) => ({ default: m.Scene })),
  { ssr: false }
);

export function SceneClient() {
  return <Scene />;
}
