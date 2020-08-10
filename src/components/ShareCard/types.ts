import { Results } from '../../constants/game';
import { TileInfo } from '../../lib/grid/types';

export interface IShareCardProps {
    performance: Results;
    text: string;
    matrix: TileInfo[][];
}
