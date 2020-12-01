import React from 'react';

import { IPerformanceProps } from './types';

export const Performance = ({
  performanceType,
  performanceValue,
}: IPerformanceProps) => {
  return (
      <span className="header__performance">
          { performanceType } { performanceValue }
      </span>
  );
};