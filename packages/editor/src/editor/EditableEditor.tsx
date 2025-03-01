import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import Editable from '../core/components/Editable';
import GlobalHotKeys from '../core/components/HotKey/GlobalHotKeys';
import { createInitialState } from '../core/zustand/store';
import type { ProviderProps } from '../core/Provider';
import Provider from '../core/Provider';
import type { ValueWithLegacy } from '../core/types';
import type { DndBackendFactory } from '../core/types/options';
import EditorUI from '../ui/EditorUI';
import StickyWrapper from './StickyWrapper';

export type DndBackend = DndBackendFactory;
export type EditableEditorProps = {
  value?: ValueWithLegacy | null;

  lang?: string;
} & ProviderProps;

const EditableEditor: FC<PropsWithChildren<EditableEditorProps>> = ({
  value,
  lang,
  children,
  options,
  renderOptions,
  callbacks,
}) => {
  const theValue = value || null;
  const defaultLang = lang || 'default';

  return (
    <Provider
      lang={defaultLang}
      value={theValue}
      options={options}
      renderOptions={renderOptions}
      callbacks={callbacks}
    >
      <StickyWrapper>
        {(stickyNess) => (
          <>
            <GlobalHotKeys focusRef={stickyNess.focusRef} />
            <Editable />
            <EditorUI stickyNess={stickyNess} />
            {children}
          </>
        )}
      </StickyWrapper>
    </Provider>
  );
};

export default EditableEditor;
