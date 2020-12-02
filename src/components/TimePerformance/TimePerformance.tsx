import React, { useState, useRef, useEffect } from 'react';

import { ITimerPerformanceProps } from './types';

import { Performance } from '../Performance';
import { formatSeconds } from '../../utils/time';
import { PerformanceTypes } from '../../constants/game';

export const TimePerformance = ({
  onUpdate,
}: ITimerPerformanceProps) => {
  const [seconds, setSeconds] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const time = formatSeconds(seconds);

  useEffect(
      () => {
          let counter = 0;
          timer.current = setInterval(() => {
              counter++;
              setSeconds(counter);
          }, 1000);

          return () => {
            if (timer.current) {
              clearInterval(timer.current);
            }
          };
      },
      [timer, setSeconds]
  );

  useEffect(() => onUpdate(seconds), [seconds, onUpdate]);

  return <Performance
      performanceType={PerformanceTypes.Time}
      performanceValue={time}
  />;
};