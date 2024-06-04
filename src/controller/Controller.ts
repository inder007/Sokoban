import { LevelMetadata } from "../model/LevelMetadata";
import { GameState } from "./GameState";
import { Painter } from "./Painter";
import images from "../resources/images.json";

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

    document
      .getElementById("undo")
      ?.addEventListener("click", () => this.undo());
    const ctx = this.canvas.getContext("2d");
    if (ctx == null) {
      throw "ctx is null";
    }
    this.gameState = new GameState(this.levelMetadata);
    console.log(this.gameState);

    this.painter = new Painter(ctx, this.gameState);
  }

  private undo() {
    this.gameState.undo();
    this.painter.paint();
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
    const popup = document.getElementById("popup") as HTMLDivElement;
    if (this.gameState.isGameFinished()) {
      popup.style.display = "block";
    } else {
      popup.style.display = "none";
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
    console.log(canvas);
    if (canvas == null) throw "Canvas not found";
    const controller = new Controller(canvas, levelMetadata);
    controller.start();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  Object.entries(images).forEach((entry) => {
    const img = new Image();
    img.src = entry[1];
    img.onload = () => {
      Painter.imagesMap.set(entry[0], img);
    };
  });
  initializeWithLevel();

  document
    .getElementById("reset-game")
    ?.addEventListener("click", () => initializeWithLevel());
});
