import { Results } from '../../constants/game';
import { TileInfo } from '../../lib/grid';

export interface IShareCardProps {
    performance: Results;
    text: string;
    matrix: TileInfo[][];
    onDraw: (blob: Blob | null) => void;
}
