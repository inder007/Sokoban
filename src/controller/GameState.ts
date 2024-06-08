import { Cargo } from "../model/Cargo";
import { FinalLocation } from "../model/FinalLocation";
import { GameMove } from "../model/GameMove";
import { ILocation } from "../model/ILocation";
import { LevelMetadata } from "../model/LevelMetadata";
import { Player } from "../model/Player";
import { Wall } from "../model/Wall";

export class GameState {
  width: number;
  height: number;
  private gameMoves: GameMove[] = new Array<GameMove>();

  // keeping everything as location string to object map for O(1) average access.
  private wallLocationsMap: Map<string, Wall> = new Map<string, Wall>();
  private emptyLocationsMap: Map<string, ILocation> = new Map<
    string,
    ILocation
  >();
  private cargoLocationsMap: Map<string, Cargo> = new Map<string, Cargo>();
  private finalLocationsMap: Map<string, FinalLocation> = new Map<
    string,
    FinalLocation
  >();
  private playerLocation: Player;

  constructor(levelMetadata: LevelMetadata) {
    this.width = levelMetadata.width;
    this.height = levelMetadata.height;
    for (let i = 0; i < levelMetadata.wallLocation.xPos.length; i++) {
      const wall: Wall = {
        xPos: levelMetadata.wallLocation.xPos[i],
        yPos: levelMetadata.wallLocation.yPos[i],
      };
      this.wallLocationsMap.set(JSON.stringify(wall), wall);
    }
    for (let i = 0; i < levelMetadata.emptyLocation.xPos.length; i++) {
      const emptyLocation: ILocation = {
        xPos: levelMetadata.emptyLocation.xPos[i],
        yPos: levelMetadata.emptyLocation.yPos[i],
      };
      this.emptyLocationsMap.set(JSON.stringify(emptyLocation), emptyLocation);
    }
    for (let i = 0; i < levelMetadata.cargoLocation.xPos.length; i++) {
      const cargoLocation: Cargo = {
        xPos: levelMetadata.cargoLocation.xPos[i],
        yPos: levelMetadata.cargoLocation.yPos[i],
      };
      this.cargoLocationsMap.set(JSON.stringify(cargoLocation), cargoLocation);
    }
    for (let i = 0; i < levelMetadata.finalLocation.xPos.length; i++) {
      const finalLocation: FinalLocation = {
        xPos: levelMetadata.finalLocation.xPos[i],
        yPos: levelMetadata.finalLocation.yPos[i],
      };
      this.finalLocationsMap.set(JSON.stringify(finalLocation), finalLocation);
    }
    this.playerLocation = {
      xPos: levelMetadata.playerLocation.xPos,
      yPos: levelMetadata.playerLocation.yPos,
    };
  }

  get wallMap() {
    return this.wallLocationsMap;
  }

  get emptyMap() {
    return this.emptyLocationsMap;
  }

  get cargoMap() {
    return this.cargoLocationsMap;
  }

  get player() {
    return this.playerLocation;
  }

  get finalMap() {
    return this.finalLocationsMap;
  }

  private isValidMove(
    expectedPlayerLocation: ILocation,
    direction: number[]
  ): boolean {
    const location: string = JSON.stringify(expectedPlayerLocation);
    if (this.wallLocationsMap.has(location)) {
      return false;
    }
    if (this.cargoLocationsMap.has(location)) {
      const nextToBox: ILocation = {
        xPos: expectedPlayerLocation.xPos + direction[0],
        yPos: expectedPlayerLocation.yPos + direction[1],
      };
      const nextToBoxLocation = JSON.stringify(nextToBox);
      if (
        this.cargoLocationsMap.has(nextToBoxLocation) ||
        this.wallLocationsMap.has(nextToBoxLocation)
      ) {
        return false;
      }
    }
    return true;
  }

  move(direction: number[]): boolean {
    const expectedPlayerLocation: ILocation = {
      xPos: this.playerLocation.xPos + direction[0],
      yPos: this.playerLocation.yPos + direction[1],
    };

    if (!this.isValidMove(expectedPlayerLocation, direction)) {
      return false;
    }

    this.playerLocation.xPos += direction[0];
    this.playerLocation.yPos += direction[1];
    const expectedPlayerLocationString = JSON.stringify(expectedPlayerLocation);
    const cargo = this.cargoLocationsMap.get(expectedPlayerLocationString);
    if (cargo == null) {
      this.gameMoves.push({
        xPos: direction[0],
        yPos: direction[1],
        moveBox: false,
      });
      return true;
    }
    this.cargoLocationsMap.delete(expectedPlayerLocationString);
    cargo.xPos += direction[0];
    cargo.yPos += direction[1];
    this.cargoLocationsMap.set(JSON.stringify(cargo), cargo);
    this.gameMoves.push({
      xPos: direction[0],
      yPos: direction[1],
      moveBox: true,
    });
    return true;
  }

  isGameFinished(): boolean {
    for (let location of this.cargoLocationsMap.keys()) {
      if (!this.finalLocationsMap.has(location)) {
        return false;
      }
    }
    return true;
  }

  undo() {
    if (!this.gameMoves.length) {
      return;
    }
    const gameMove = this.gameMoves.pop();
    if (gameMove == null) {
      return;
    }

    if (gameMove.moveBox) {
      const currBoxLocation = JSON.stringify({
        xPos: this.playerLocation.xPos + gameMove.xPos,
        yPos: this.playerLocation.yPos + gameMove.yPos,
      });
      const cargo = this.cargoLocationsMap.get(currBoxLocation);
      if (cargo == null) {
        return;
      }
      this.cargoLocationsMap.delete(currBoxLocation);
      cargo.xPos -= gameMove.xPos;
      cargo.yPos -= gameMove.yPos;
      this.cargoLocationsMap.set(JSON.stringify(cargo), cargo);
    }
    this.playerLocation.xPos -= gameMove.xPos;
    this.playerLocation.yPos -= gameMove.yPos;
  }
}
