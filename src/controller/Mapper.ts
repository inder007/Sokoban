import { LevelMetadata } from "../model/LevelMetadata";
import { maps } from "../resources/map";

export class Mapper {
  public static mapToLevelMetadata(level: number): LevelMetadata {
    const levelMap: number[][] = maps[level - 1];
    const width = levelMap[0].length;
    const height = levelMap.length;
    const wallxPos: number[] = [];
    const wallyPos: number[] = [];
    const emptyxPos: number[] = [];
    const emptyyPos: number[] = [];
    const targetxPos: number[] = [];
    const targetyPos: number[] = [];
    const cargoxPos: number[] = [];
    const cargoyPos: number[] = [];
    let playerx: number = 0;
    let playery: number = 0;
    console.log(width, height);
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        // console.log(levelMap, i, j);
        switch (levelMap[j][i]) {
          case 0:
            emptyxPos.push(i);
            emptyyPos.push(j);
            break;
          case 1:
            wallxPos.push(i);
            wallyPos.push(j);
            break;
          case 3:
            targetxPos.push(i);
            targetyPos.push(j);
            break;
          case 4:
            cargoxPos.push(i);
            cargoyPos.push(j);
            break;
          case 5:
            targetxPos.push(i);
            targetyPos.push(j);
            cargoxPos.push(i);
            cargoyPos.push(j);
            break;
          case 6:
            playerx = i;
            playery = j;
            break;
        }
      }
    }
    const levelMetadata: LevelMetadata = {
      width: width,
      height: height,
      wallLocation: { xPos: wallxPos, yPos: wallyPos },
      emptyLocation: { xPos: emptyxPos, yPos: emptyyPos },
      cargoLocation: { xPos: cargoxPos, yPos: cargoyPos },
      finalLocation: { xPos: targetxPos, yPos: targetyPos },
      playerLocation: { xPos: playerx, yPos: playery },
    };
    return levelMetadata;
  }
}
