import type { NodeWithAncestors, ValueWithHistory } from './node';
import type { Display } from './display';
import type { Focus } from './focus';
import type { Hover } from './hover';

export type RootState = {
  reactPage: {
    values: ValueWithHistory;
    display: Display;
    focus: Focus | null;
    hover: Hover | null;
    settings: {
      lang?: string;
    };
    __nodeCache?: Record<string, NodeWithAncestors | null>;
  };
};
