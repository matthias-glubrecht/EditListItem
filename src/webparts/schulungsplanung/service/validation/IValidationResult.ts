export interface IValidationResult {
    isValid: boolean;
    errors: { [key: string]: string };
}