export interface AfternoonTeaForm {
  budget: number;
  expiration: string;
  form: Form[];
  update_time?: string;
  user: string;
}

export interface Form {
  menuImage: string;
  isEnd: boolean;
  formLabel: string;
  formKey: string;
  items: Item[];
}


export interface Item {
  itemLabel: string;
  itemKey: string;
  value: number;
  collapse: boolean;
  selections: {
    size?: number
  };
  isClone?: boolean;
  options: Options[];
  canClone: boolean;
}
export interface RadioSelection {
  selectionLabel: string;
  selectionKey: string;
  price?: number;
  value?: string;
}
export interface CheckBoxSelection {
  selectionLabel: string;
  selectionKey: string;
  price: number;
  choose: boolean;
}

export interface Options {
  optionLabel: string;
  optionKey: string;
  radioSelections?: RadioSelection[];
  checkBoxOptions?: CheckBoxSelection[];
}
