import { describe, test, expect, beforeEach } from 'bun:test';
import { migrateValue } from '../migrate';
import type { Value } from '../../types';
import { CURRENT_EDITABLE_VERSION } from '../EDITABLE_MIGRATIONS';
import type { Value_v0 } from '../EDITABLE_MIGRATIONS/from0to1';

type I18nField<T> = {
  [lang: string]: T;
};

type PluginOld = {
  name: string;
  version: number | string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Content<StateT = any> = {
  plugin: PluginOld;
  state?: StateT;
  stateI18n?: I18nField<StateT>;
};

type NodeBase = {
  id: string;
  levels?: {
    left: number;
    right: number;
    above: number;
    below: number;
  };
  hoverPosition?: string;
};

type CellOld = NodeBase & {
  rows?: Array<{
    id: string;
    cells: CellOld[];
  }> | null;

  content?: Content;
  layout?: Content;

  size?: number;

  inline?: string | null;

  isDraft?: boolean;
  isDraftI18n?: I18nField<boolean>;

  resizable?: boolean;
  bounds?: { left: number; right: number };
  hasInlineNeighbour?: string;
};

let index = 1;
const mockCreateId = () => 'nodeId_' + index++;

// Mock the createId function using Bun's test mocking
import { mock } from 'bun:test';
mock.module('../../utils/createId', () => ({
  createId: mockCreateId,
}));

describe('migrateValue', () => {
  beforeEach(() => {
    index = 1;
  });

  test('should migrate unversioned state', () => {
    const unversionedState: Value_v0 = {
      id: 'some-id',
      cells: [
        {
          id: 'cell-1',
          content: {
            plugin: {
              name: 'ory/editor/core/content/slate',
              version: '0.0.1',
            },
            state: {},
          },
        } as CellOld,
      ],
    };

    const migratedState = migrateValue(unversionedState, {
      lang: 'en',
      cellPlugins: [],
    });
    expect(migratedState).toEqual({
      id: 'some-id',
      version: CURRENT_EDITABLE_VERSION,
      rows: [
        {
          id: 'nodeId_2',
          cells: [
            {
              id: 'nodeId_1',
              plugin: {
                id: 'ory/editor/core/content/slate',
                version: 0.0001,
              },
              dataI18n: {
                en: {},
              },
            },
          ],
        },
      ],
    });
  });

  test('should migrate complex unversioned state', () => {
    const oldEditable: Value_v0 = {
      id: 'editableId',
      cells: [
        {
          id: 'cell1',
          rows: [
            {
              id: 'row1',
              cells: [
                {
                  id: 'cell2',
                  content: {
                    plugin: {
                      name: 'ory/editor/core/content/slate',
                      version: '0.0.1',
                    },
                    state: { foo: 'bar' },
                  },
                } as CellOld,
              ],
            },
          ],
        } as CellOld,
      ],
    };

    const migratedState = migrateValue(oldEditable, {
      lang: 'en',
      cellPlugins: [],
    });
    expect(migratedState).toEqual({
      id: 'editableId',
      version: CURRENT_EDITABLE_VERSION,
      rows: [
        {
          id: 'nodeId_4',
          cells: [
            {
              id: 'nodeId_1',
              rows: [
                {
                  id: 'nodeId_3',
                  cells: [
                    {
                      id: 'nodeId_2',
                      plugin: {
                        id: 'ory/editor/core/content/slate',
                        version: 0.0001,
                      },
                      dataI18n: {
                        en: { foo: 'bar' },
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
  });
});
