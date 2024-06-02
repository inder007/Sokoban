import { Cargo } from "../model/Cargo";
import { FinalLocation } from "../model/FinalLocation";
import { ILocation } from "../model/ILocation";
import { LevelMetadata } from "../model/LevelMetadata";
import { Player } from "../model/Player";
import { Wall } from "../model/Wall";

export class GameState {
  private width: number;
  private height: number;

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
}
