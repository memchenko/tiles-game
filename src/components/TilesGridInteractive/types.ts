import { TileInfo } from '../../lib/grid/types';

export interface ITilesGridInteractiveProps {
    matrix: TileInfo[][];
    onMatrixChange(matrix: TileInfo[][]): void;
}
