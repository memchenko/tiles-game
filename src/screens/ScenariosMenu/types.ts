import { Difficulties } from '../../constants/game';

export interface IScenarioItemProps {
    id: number | string;
    icon: string;
    title: string;
    difficulty: Difficulties;
}
