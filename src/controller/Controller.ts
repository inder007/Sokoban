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
    // Add event listener for keydown event
    window.addEventListener("keydown", (event) =>
      this.handleKeyboardEvent(event)
    );
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

  // Method to handle keyboard events
  handleKeyboardEvent(event: KeyboardEvent): void {
    const direction = this.getDirection(event.key);
    if (direction[0] == 0 && direction[1] == 0) {
      return;
    }
    if (this.gameState.move(direction)) {
      this.painter.paint();
    }
  }

  private getDirection(key: string): number[] {
    var direction: number[] = [0, 0];
    if (key == "a" || key == "ArrowLeft") {
      direction = [-1, 0];
    } else if (key == "w" || key == "ArrowUp") {
      direction = [0, -1];
    } else if (key == "d" || key == "ArrowRight") {
      direction = [1, 0];
    } else if (key == "s" || key == "ArrowDown") {
      direction = [0, 1];
    }
    return direction;
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
