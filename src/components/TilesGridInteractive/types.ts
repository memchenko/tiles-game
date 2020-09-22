import { TileInfo } from '../../lib/grid';

export interface ITilesGridInteractiveProps {
    matrix: TileInfo[][];
    onMatrixChange(matrix: TileInfo[][]): void;
}
