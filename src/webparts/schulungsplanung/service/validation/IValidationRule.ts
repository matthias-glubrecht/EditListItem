export interface IValidationRule {
    validate(value: any, allValues: { [key: string]: any }): { isValid: boolean; message: string };
}