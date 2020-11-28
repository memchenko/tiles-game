import { Results } from '../../constants/game';
import { TileInfo } from '../../lib/grid';

export interface IShareCardProps {
    performance: Results;
    text: string;
    level: number;
    matrix: TileInfo[][];
    onDraw: (blob: Blob | null) => void;
}
