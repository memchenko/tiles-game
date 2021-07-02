import { Results } from '../../constants/game';

export interface IShareCardProps {
    performance: Results;
    text: string;
    level: number;
    matrix: string[][];
    onDraw: (blob: Blob | null) => void;
}
