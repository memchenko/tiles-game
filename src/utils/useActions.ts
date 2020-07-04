import { bindActionCreators } from 'redux'
import { useDispatch } from 'react-redux'
import { useMemo } from 'react'
import { ActionCreator, AnyAction } from 'deox';

export function useActions<T extends AnyAction>(
    actions: ActionCreator<T> | ActionCreator<T>[]
) {
  const dispatch = useDispatch();

  return useMemo(
    () => {
      if (Array.isArray(actions)) {
        return actions.map(a => bindActionCreators(a, dispatch));
      }
      return bindActionCreators(actions, dispatch);
    },
    [dispatch, actions]
  )
}
