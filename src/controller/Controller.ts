import { LevelMetadata } from "../model/LevelMetadata";
import { GameState } from "./GameState";
import { Painter } from "./Painter";

class Controller {
  private gameState: GameState;
  private painter: Painter;

  constructor(
    private canvas: HTMLCanvasElement,
    private levelMetadata: LevelMetadata
  ) {
    const ctx = this.canvas.getContext("2d");
    if (ctx == null) {
      throw "ctx is null";
    }
    this.gameState = new GameState(this.levelMetadata);
    this.painter = new Painter(ctx, this.gameState);
  }

  start() {
    this.painter.paint();
  }
}

async function fetchLevelMetadata(level: number): Promise<LevelMetadata> {
  return import(`../resources/level_${level}.json`);
}

function initializeWithLevel(level: number = 1) {
  fetchLevelMetadata(level).then((levelMetadata) => {
    const canvas: HTMLCanvasElement | null = document.getElementById(
      "game-canvas"
    ) as HTMLCanvasElement | null;
    if (canvas == null) throw "Canvas not found";
    const controller = new Controller(canvas, levelMetadata);
    controller.start();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initializeWithLevel();
});
