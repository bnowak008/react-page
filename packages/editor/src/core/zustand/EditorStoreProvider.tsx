import type { FC, PropsWithChildren } from 'react';
import React, { useEffect, useMemo, useRef } from 'react';
import {
  useCallbackOption,
  useOption,
  useRenderOption,
} from '../components/hooks';
import EditorStore, { EditorContext } from './EditorStore';
import { migrateValue } from '../migrations/migrate';
import { serialzeValue } from '../migrations/serialzeValue';
import { createInitialState } from './store';
import type { ValueWithLegacy } from '../types';
import deepEquals from '../utils/deepEquals';

const EditorStoreProvider: FC<
  PropsWithChildren<{
    lang: string;
    value: ValueWithLegacy | null;
  }>
> = ({ children, lang, value }) => {
  const cellPlugins = useRenderOption('cellPlugins');
  const storeFromOptions = useOption('store');
  const onChangeLang = useCallbackOption('onChangeLang');
  const onChange = useCallbackOption('onChange');
  
  const editorStore = useMemo<EditorStore>(() => {
    const store = new EditorStore({
      initialState: createInitialState(
        migrateValue(value, {
          cellPlugins,
          lang,
        }),
        lang
      ),
      store: storeFromOptions,
    });
    return store;
  }, [storeFromOptions]);
  
  const lastValueRef = useRef<ValueWithLegacy | null>(value);
  
  useEffect(() => {
    let oldLang: string | undefined = lang;
    
    const handleChanges = () => {
      // notify outsiders to new language, when changed in ui
      const newLang = editorStore.getState().reactPage.settings.lang;
      if (newLang && (newLang !== oldLang || newLang !== lang)) {
        oldLang = newLang;
        onChangeLang?.(newLang);
      }
      
      if (!onChange) {
        return;
      }
      
      const currentValue = editorStore.getState().reactPage.values.present;

      if (!currentValue) {
        return;
      }
      
      const serializedValue = serialzeValue(currentValue, cellPlugins);
      const serializedEqual = deepEquals(lastValueRef.current, serializedValue);

      if (serializedEqual) {
        return;
      }

      lastValueRef.current = serializedValue;
      onChange(serializedValue);
    };
    
    // Subscribe to store changes
    const unsubscribe = editorStore.subscribe(handleChanges);
    
    return () => {
      unsubscribe();
    };
  }, [editorStore, onChange, cellPlugins]);

  useEffect(() => {
    const equal = deepEquals(value, lastValueRef.current);
    // value changed from outside
    if (!equal) {
      lastValueRef.current = value;

      const migratedValue = migrateValue(value, {
        cellPlugins,
        lang,
      });
      editorStore.updateValue(migratedValue);
    }
  }, [value, cellPlugins, lang]);
  
  useEffect(() => {
    // if changed from outside
    editorStore.setLang(lang);
  }, [editorStore, lang]);

  return (
    <EditorContext.Provider value={editorStore}>
      {children}
    </EditorContext.Provider>
  );
};

export default EditorStoreProvider; 