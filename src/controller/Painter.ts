import { GameState } from "./GameState";

export class Painter {
  private tileSize: number = 50;
  public static imagesMap: Map<string, HTMLImageElement> = new Map();

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
    const img = Painter.imagesMap.get("floor");
    if (img == null) {
      throw "floor image not found.";
    }
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 9; j++) {
        this.ctx.drawImage(
          img,
          i * this.tileSize,
          j * this.tileSize,
          this.tileSize,
          this.tileSize
        );
      }
    }
  }

  private paintWall() {
    const img = Painter.imagesMap.get("wall");
    if (img == null) {
      throw "wall image not found.";
    }
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
    const img = Painter.imagesMap.get("empty");
    for (let location of this.gameState.emptyMap.values()) {
      this.ctx.drawImage(
        img!,
        location.xPos * this.tileSize,
        location.yPos * this.tileSize,
        this.tileSize,
        this.tileSize
      );
    }
  }

  private paintCargo() {
    const img = Painter.imagesMap.get("cargo");
    for (let location of this.gameState.cargoMap.values()) {
      this.ctx.drawImage(
        img!,
        location.xPos * this.tileSize,
        location.yPos * this.tileSize,
        this.tileSize,
        this.tileSize
      );
    }
  }

  private paintPlayer() {
    const img = Painter.imagesMap.get("player");
    this.ctx.drawImage(
      img!,
      this.gameState.player.xPos * this.tileSize,
      this.gameState.player.yPos * this.tileSize,
      this.tileSize,
      this.tileSize
    );
  }

  private paintFinalLocation() {
    const img = Painter.imagesMap.get("target");
    const imageOnTarget = Painter.imagesMap.get("cargo_on_target");
    for (let location of this.gameState.finalMap.values()) {
      if (this.gameState.cargoMap.has(JSON.stringify(location))) {
        this.ctx.drawImage(
          imageOnTarget!,
          location.xPos * this.tileSize,
          location.yPos * this.tileSize,
          this.tileSize,
          this.tileSize
        );
      } else {
        this.ctx.drawImage(
          img!,
          location.xPos * this.tileSize,
          location.yPos * this.tileSize,
          this.tileSize,
          this.tileSize
        );
      }
    }
  }
}
