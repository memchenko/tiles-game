import { IPushable } from "../../interfaces/push-pull";
import { ISubscribable } from "../../interfaces/pub-sub";
import { IRendereableMatrix } from "../matrix-calculator";
import { IGridContext } from "../grid-context";

export interface IRenderInfo<T> {
  context: IGridContext;
  matrix: IRendereableMatrix<T>;
}

export type IRenderer<T> = IPushable<IRenderInfo<T>> &
  ISubscribable<"push", void>;
