export interface FormField {
  type: 'text' | 'email' | 'password' | 'textarea' | 'number' | 'select' | 'date' | 'file';
  label: string;
  name: string;
  placeholder?: string;
  options?: {
    label: string;
    value: any;
  }[];
  value?: any;
  readonly?: boolean;
  disabled?: boolean;
  visible?: boolean;
  mask?: string;
}
