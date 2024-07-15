import { useEffect, useRef } from "react";
import { NeatGradient } from "@firecms/neat";

export default function Background() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gradientRef = useRef<NeatGradient | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    gradientRef.current = new NeatGradient({
      ref: canvasRef.current,
      colors: [
        {
          color: "#FFFFFF",
          enabled: true,
        },
        {
          color: "#FFDEBB",
          enabled: true,
        },
        {
          color: "#FBECC1",
          enabled: true,
        },
        {
          color: "#E4E4E4",
          enabled: true,
        },
        {
          color: "#F6FFFF",
          enabled: true,
        },
      ],
      speed: 2,
      horizontalPressure: 2,
      verticalPressure: 5,
      waveFrequencyX: 2,
      waveFrequencyY: 4,
      waveAmplitude: 3,
      shadows: 7,
      highlights: 6,
      colorBrightness: 1,
      colorSaturation: 1,
      wireframe: false,
      colorBlending: 7,
      backgroundColor: "#0b3954",
      backgroundAlpha: 1,
      resolution: 1,
    });

    return gradientRef.current.destroy;
  }, []);

  return (
    <canvas
      className="-z-10 absolute"
      style={{
        isolation: "isolate",
        height: "100%",
        width: "100%",
      }}
      ref={canvasRef}
    />
  );
}
