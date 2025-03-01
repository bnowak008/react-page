import { CURRENT_EDITABLE_VERSION } from '../migrations/EDITABLE_MIGRATIONS';
import type { Value, PartialRow, Row, Cell, PartialCell } from '../types/node';
import { CellPlugin } from '../types/plugins';
import { createId } from './createId';
import { getChildCellPlugins } from './getAvailablePlugins';
import { getCellData } from './getCellData';
import { removeUndefinedProps } from './removeUndefinedProps';

type PartialValue = {
  id?: string;
  rows?: PartialRow[];
};

type PluginsAndLang = {
  plugins: CellPlugin[];
  lang: string;
};

/**
 * Creates a cell from a partial cell definition
 */
export const createCell = (
  partialCell: PartialCell,
  options: PluginsAndLang
): Cell => {
  const { plugins: cellPlugins, lang } = options;
  const pluginId =
    partialCell.plugin &&
    (typeof partialCell.plugin == 'string'
      ? partialCell.plugin
      : partialCell.plugin.id);
  const plugin = pluginId ? cellPlugins.find((p) => p.id === pluginId) : null;

  const partialRows = partialCell.rows?.length
    ? partialCell.rows
    : plugin?.createInitialChildren?.() ?? [];
  const dataI18n = {
    [lang]:
      partialCell?.data ??
      plugin?.createInitialData?.(partialCell) ??
      plugin?.createInitialState?.(partialCell) ??
      null,
    ...(partialCell.dataI18n ?? {}),
  };
  return removeUndefinedProps({
    id: partialCell.id ?? createId(),
    isDraft: partialCell.isDraft,
    isDraftI18n: partialCell.isDraftI18n,
    inline: partialCell.inline,
    size: partialCell.size || 12,

    hasInlineNeighbour: partialCell.hasInlineNeighbour,
    plugin: plugin
      ? {
          id: plugin.id,
          version: plugin.version,
        }
      : undefined,
    rows: partialRows?.map((r) =>
      createRow(r, {
        plugins: getChildCellPlugins(cellPlugins, {
          pluginId,
          data: getCellData(
            {
              dataI18n,
            },
            lang
          ),
        }),
        lang,
      })
    ),
    dataI18n: dataI18n,
  });
};

/**
 * Creates a row from a partial row definition
 */
export const createRow = (
  partialRow: PartialRow,
  options: PluginsAndLang
): Row => {
  if (Array.isArray(partialRow)) {
    return {
      id: createId(),
      cells: partialRow.map((c) => createCell(c, options)),
    };
  }
  return removeUndefinedProps({
    id: createId(),
    ...partialRow,
    cells: partialRow.cells?.map((c) => createCell(c, options)) ?? [],
  });
};

/**
 * Creates a value from a partial value definition
 */
export const createValue = (
  partial: PartialValue,
  options: PluginsAndLang
): Value => {
  return {
    id: partial.id || createId(),
    rows: partial.rows?.map((c) => createRow(c, options)) ?? [],
    version: CURRENT_EDITABLE_VERSION,
  };
};
