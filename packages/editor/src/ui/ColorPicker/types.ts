import { ColorResult } from 'react-color';

export interface ColorPickerProps {
  color?: string;
  onChange?: (color: ColorResult) => void;
  onChangeComplete?: (color: ColorResult) => void;
  buttonContent?: JSX.Element | string;
  icon?: JSX.Element | string;
  onDialogOpen?: () => void;
  style?: React.CSSProperties;
}

export type ColorPickerState = {
  isColorPickerVisible: boolean;
};
