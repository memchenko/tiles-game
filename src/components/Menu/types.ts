export interface IMenuItem {
    text: string;
    onClick: () => void;
}

export interface IMenuProps {
    list: IMenuItem[];
}
