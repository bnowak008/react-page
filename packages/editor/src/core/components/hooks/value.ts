import { useCurrentValue } from '../../zustand/hooks';
import type { Value } from '../../types/node';
import deepEquals from '../../utils/deepEquals';
import { useMemo, useRef } from 'react';

type ValueSelector<T> = (node: Value | null) => T;
/**
 *
 * @param selector receives the current value node object and returns T
 * @returns the selection T
 */
export const useValueNode = <T>(selector: ValueSelector<T>) => {
  const value = useCurrentValue();

  const result = useMemo(() => selector(value), [value, selector]);

  const prevResultRef = useRef(result);
  const finalResult = useMemo(() => {
    if (!deepEquals(prevResultRef.current, result)) {
      prevResultRef.current = result;
    }
    return prevResultRef.current;
  }, [result]);

  return finalResult;
};
