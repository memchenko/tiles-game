import React, { useEffect, useRef } from "react";
import { Subscription } from "rxjs";

import { ITilesGridInteractiveProps } from "./types";
import "./TilesGridInteractive.scss";

import { Grid } from "../../lib/grid";
import { drawSolidRect } from "../../lib/grid/renderer";
import { DPI, isLandscape } from "../../constants/device";

export const TilesGridInteractive = React.memo(function TilesGridInteractive({
  matrix,
  onMatrixChange,
}: ITilesGridInteractiveProps) {
  const canvas = useRef(null);
  const gridManager = useRef<Subscription | null>(null);

  useEffect(() => {
    if (!canvas.current) {
      return;
    }

    if (gridManager.current) {
      return;
    }

    const canvasEl = canvas.current as unknown as HTMLCanvasElement;
    const { width, height } = canvasEl.getBoundingClientRect();

    if (isLandscape()) {
      ["width", "height"].forEach((attr) =>
        canvasEl.setAttribute(attr, String(height * DPI))
      );
    } else {
      ["width", "height"].forEach((attr) =>
        canvasEl.setAttribute(attr, String(width * DPI))
      );
    }

    const grid = new Grid(matrix, canvasEl, drawSolidRect);
    gridManager.current = grid.changed$.subscribe(onMatrixChange);

    return () => {
      if (gridManager.current) {
        gridManager.current.unsubscribe();
      }
    };
  }, [matrix, onMatrixChange, canvas, gridManager]);

  return (
    <div className="tiles-grid-interactive">
      <canvas ref={canvas} className="tiles-grid-interactive__canvas"></canvas>
    </div>
  );
});
