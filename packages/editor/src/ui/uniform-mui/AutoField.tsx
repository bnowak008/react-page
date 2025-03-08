import { AutoField as UniformsAutoField } from 'uniforms-mui';
import type { FieldProps } from 'uniforms';

export interface AutoFieldProps extends FieldProps<any, any> {
  checkboxes?: boolean;
  fieldType: any;
  allowedValues?: any[];
  variant?: 'outlined' | 'standard' | 'filled';
}

const AutoField = UniformsAutoField;

export default AutoField;
