import React from 'react';
import type { CellPlugin } from '@react-page/editor';

// Add index signature to satisfy DataTType constraint
interface TwitterTimelineState {
  title: string;
  screenName: string;
  height: number;
  [key: string]: unknown;
}

const TwitterTimeline: React.FC<{ data: TwitterTimelineState }> = ({ data }) => {
  return (
    <div>
      <h3>{data.title}</h3>
      <div style={{ height: `${data.height}px`, overflow: 'auto' }}>
        <p>Twitter timeline for @{data.screenName}</p>
        <p><em>This is a placeholder for the Twitter timeline component</em></p>
      </div>
    </div>
  );
};

export const twitterTimelinePlugin: CellPlugin<TwitterTimelineState> = {
  id: 'twitter-timeline',
  title: 'Twitter Timeline',
  description: 'Display a Twitter timeline',
  version: 1,
  Renderer: TwitterTimeline,
  // Use the correct property name based on CellPlugin interface
  createInitialData: () => ({
    title: 'Twitter Timeline',
    screenName: 'typescript',
    height: 600,
  }),
}; 