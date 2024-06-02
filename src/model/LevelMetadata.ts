export interface LevelMetadata {
  width: number;
  height: number;
  wallLocation: {
    xPos: number[];
    yPos: number[];
  };
  emptyLocation: {
    xPos: number[];
    yPos: number[];
  };
  cargoLocation: {
    xPos: number[];
    yPos: number[];
  };
  playerLocation: {
    xPos: number;
    yPos: number;
  };
  finalLocation: {
    xPos: number[];
    yPos: number[];
  };
}
