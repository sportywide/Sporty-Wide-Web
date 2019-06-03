export interface IForm {
	id: string;
	name: string;
	fields: IFormField[];
}

export enum FieldType {
	Textbox = 'textbox',
	Dropdown = 'dropdown',
	Checkbox = 'checkbox',
	Textarea = 'textarea',
	File = 'file',
}

export interface IFieldOption {
	label: string;
	value: any;
}

export interface IFormField {
	id: string;
	type: FieldType;
	label: string;
	value: any;
	placeholder?: string;
	options?: IFieldOption[];
}
