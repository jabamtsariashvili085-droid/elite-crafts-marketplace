import { lazy, Suspense } from "react";
import HeroContent from "@/components/HeroContent";

const Scene3D = lazy(() => import("@/components/Scene3D"));

const Index = () => {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      {/* 3D Background */}
      <Suspense fallback={<div className="absolute inset-0 bg-background" />}>
        <Scene3D />
      </Suspense>

      {/* Gradient overlays */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background/80" />

      {/* Content */}
      <HeroContent />
    </main>
  );
};

export default Index;
