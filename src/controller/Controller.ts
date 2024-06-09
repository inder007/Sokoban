import { LevelMetadata } from "../model/LevelMetadata";
import { GameState } from "./GameState";
import { Painter } from "./Painter";
import images from "../resources/images.json";
import { Mapper } from "./Mapper";
import { maps } from "../resources/Map";

class Controller {
  private gameState: GameState;
  private painter: Painter;

  constructor(
    private canvas: HTMLCanvasElement,
    private levelMetadata: LevelMetadata,
    private level: number
  ) {
    const ctx = this.canvas.getContext("2d");
    if (ctx == null) {
      throw "ctx is null";
    }
    this.gameState = new GameState(this.levelMetadata);
    this.painter = new Painter(ctx, this.gameState);
    canvas.width = levelMetadata.width * this.painter.tileSize;
    canvas.height = levelMetadata.height * this.painter.tileSize;
  }

  undo = () => {
    this.gameState.undo();
    this.painter.paint();
  };

  start() {
    this.painter.paint();
  }

  // Method to handle keyboard events
  handleKeyboardEvent = (event: KeyboardEvent): void => {
    if (event.key == "u") {
      this.undo();
      return;
    }
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
      setTimeout(() => {
        const dropDownContent = document.getElementById(
          "levels"
        ) as HTMLSelectElement;
        popup.style.display = "none";
        initializeWithLevel(this.level + 1);
        dropDownContent.value = `${this.level + 1}`;
      }, 2000);
    } else {
      popup.style.display = "none";
    }
  };

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

let resetGameFunction: Function | null;
function initializeWithLevel(level: number) {
  resetGameFunction?.();

  const levelMetadata = Mapper.mapToLevelMetadata(level);
  const canvas: HTMLCanvasElement | null = document.getElementById(
    "game-canvas"
  ) as HTMLCanvasElement | null;
  if (canvas == null) throw "Canvas not found";
  canvas.focus();
  const controller = new Controller(canvas, levelMetadata, level);

  // Add event listener for keydown event
  window.addEventListener("keydown", controller.handleKeyboardEvent);

  document.getElementById("undo")?.addEventListener("click", controller.undo);

  controller.start();
  resetGameFunction = () => {
    window.removeEventListener("keydown", controller.handleKeyboardEvent);

    document
      .getElementById("undo")
      ?.removeEventListener("click", controller.undo);
  };
}

function loadImage(name: string, value: string): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = value;
    img.onload = () => {
      Painter.imagesMap.set(name, img);
      resolve(img);
    };
  });
}

async function loadAllImages(): Promise<HTMLImageElement[]> {
  let promises: Promise<HTMLImageElement>[] = [];
  Object.entries(images).forEach((entry) => {
    promises.push(loadImage(entry[0], entry[1]));
  });
  return Promise.all(promises);
}

function appendLevels() {
  const dropDownContent = document.getElementById(
    "levels"
  ) as HTMLSelectElement;
  for (let i = 1; i < maps.length; i++) {
    const option = document.createElement("option");
    option.value = i + 1 + "";
    option.text = "Level " + (i + 1);
    dropDownContent?.appendChild(option);
  }

  dropDownContent.onchange = (ev) => {
    const target = ev.target as HTMLSelectElement;
    initializeWithLevel(Number.parseInt(target.value));
    ev.stopPropagation();
  };

  document.getElementById("left-button")?.addEventListener("click", () => {
    const currLevel: number = Number.parseInt(dropDownContent.value);
    initializeWithLevel(currLevel - 1);
    dropDownContent.value = `${currLevel - 1}`;
  });

  document.getElementById("right-button")?.addEventListener("click", () => {
    const currLevel: number = Number.parseInt(dropDownContent.value);
    initializeWithLevel(currLevel + 1);
    dropDownContent.value = `${currLevel + 1}`;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  appendLevels();
  const dropDownContent = document.getElementById(
    "levels"
  ) as HTMLSelectElement;
  loadAllImages().then(() =>
    initializeWithLevel(Number.parseInt(dropDownContent.value))
  );

  document
    .getElementById("reset-game")
    ?.addEventListener("click", () =>
      initializeWithLevel(Number.parseInt(dropDownContent.value))
    );
});
