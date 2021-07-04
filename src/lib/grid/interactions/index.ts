import { MouseStrategy } from "./MouseStrategy";
import { TouchStrategy } from "./TouchStrategy";
import { isTouchDevice } from "../../../utils/client";

export const getInteractionsObservables = (element: HTMLElement) => {
  if (isTouchDevice()) {
    return new TouchStrategy(element);
  } else {
    return new MouseStrategy(element);
  }
};
