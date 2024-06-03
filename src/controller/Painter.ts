import images from "../resources/images.json";
import { GameState } from "./GameState";

export class Painter {
  private tileSize: number = 50;

  constructor(
    private ctx: CanvasRenderingContext2D,
    private gameState: GameState
  ) {}

  paint() {
    // we are not taking floor from config so need to paint entire grid as floor first.
    this.paintFloor();
    this.paintEmpty();
    this.paintWall();
    this.paintCargo();
    this.paintFinalLocation();
    this.paintPlayer();
  }

  private paintFloor() {
    const floor = new Image();
    floor.src = images.floor;
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 9; j++) {
        this.ctx.drawImage(
          floor,
          i * this.tileSize,
          j * this.tileSize,
          this.tileSize,
          this.tileSize
        );
      }
    }
  }

  private paintWall() {
    const img = new Image();
    img.src = images.wall;
    for (let location of this.gameState.wallMap.values()) {
      this.ctx.drawImage(
        img,
        location.xPos * this.tileSize,
        location.yPos * this.tileSize,
        this.tileSize,
        this.tileSize
      );
    }
  }

  private paintEmpty() {
    const img = new Image();
    img.src = images.empty;
    for (let location of this.gameState.emptyMap.values()) {
      this.ctx.drawImage(
        img,
        location.xPos * this.tileSize,
        location.yPos * this.tileSize,
        this.tileSize,
        this.tileSize
      );
    }
  }

  private paintCargo() {
    const img = new Image();
    img.src = images.cargo;
    for (let location of this.gameState.cargoMap.values()) {
      this.ctx.drawImage(
        img,
        location.xPos * this.tileSize,
        location.yPos * this.tileSize,
        this.tileSize,
        this.tileSize
      );
    }
  }

  private paintPlayer() {
    const img = new Image();
    img.src = images.player;
    this.ctx.drawImage(
      img,
      this.gameState.player.xPos * this.tileSize,
      this.gameState.player.yPos * this.tileSize,
      this.tileSize,
      this.tileSize
    );
  }

  private paintFinalLocation() {
    const img = new Image();
    img.src = images.target;
    const imageOnTarget = new Image();
    imageOnTarget.src = images.cargo_on_target;
    for (let location of this.gameState.finalMap.values()) {
      if (this.gameState.cargoMap.has(JSON.stringify(location))) {
        this.ctx.drawImage(
          imageOnTarget,
          location.xPos * this.tileSize,
          location.yPos * this.tileSize,
          this.tileSize,
          this.tileSize
        );
      } else {
        this.ctx.drawImage(
          img,
          location.xPos * this.tileSize,
          location.yPos * this.tileSize,
          this.tileSize,
          this.tileSize
        );
      }
    }
  }
}
