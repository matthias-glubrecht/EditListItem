export interface IValidationRule {
    validate(value: {}, allValues: { [key: string]: {} }): { isValid: boolean; message: string };
}