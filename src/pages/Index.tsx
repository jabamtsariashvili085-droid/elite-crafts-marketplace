import { lazy, Suspense } from "react";
import HeroContent from "@/components/HeroContent";

const Scene3D = lazy(() => import("@/components/Scene3D"));

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="relative min-h-screen bg-background">
        {/* 3D Background - Parallax Fix */}
        <div className="fixed inset-0 z-0">
          <Suspense fallback={<div className="absolute inset-0 bg-background" />}>
            <Scene3D />
          </Suspense>
          {/* Gradient overlays */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background/80" />
        </div>

        {/* Content with relative z-index > 0 to scroll over the fixed background */}
        <div className="relative z-10">
          <HeroContent />
        </div>
      </main>
    </div>
  );
};

export default Index;
