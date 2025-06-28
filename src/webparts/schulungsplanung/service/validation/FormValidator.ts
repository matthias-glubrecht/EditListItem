import { IValidationResult } from './IValidationResult';
import { IValidationRule } from './IValidationRule';

export class FormValidator {
    private rules: { [key: string]: IValidationRule[] } = {};
    private values: { [key: string]: {} } = {};

    public addRule(fieldName: string, rule: IValidationRule): void {
        if (!this.rules[fieldName]) {
            this.rules[fieldName] = [];
        }
        this.rules[fieldName].push(rule);
    }

    public setValue(fieldName: string, value: {}): void {
        this.values[fieldName] = value;
    }

    public setValues(values: { [key: string]: {} }): void {
        // Only set values for fields that have validation rules defined
        Object.keys(this.rules).forEach(fieldName => {
            if (values.hasOwnProperty(fieldName)) {
                this.values[fieldName] = values[fieldName];
            }
        });
    }

    public validate(): IValidationResult {
        const errors: { [key: string]: string } = {};

        Object.keys(this.rules).forEach(fieldName => {
            const fieldRules: IValidationRule[] = this.rules[fieldName];
            const fieldValue: {} = this.values[fieldName];

            for (const rule of fieldRules) {
                const result: { isValid: boolean; message: string } = rule.validate(fieldValue, this.values);
                if (!result.isValid) {
                    errors[fieldName] = result.message;
                    break; // Erste Regel die fehlschlägt stoppt weitere
                }
            }
        });

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }

    public validateValues(values: { [key: string]: {} }): IValidationResult {
        const errors: { [key: string]: string } = {};

        Object.keys(this.rules).forEach(fieldName => {
            const fieldRules: IValidationRule[] = this.rules[fieldName];
            const fieldValue: {} = values[fieldName];

            for (const rule of fieldRules) {
                const result: { isValid: boolean; message: string } = rule.validate(fieldValue, values);
                if (!result.isValid) {
                    errors[fieldName] = result.message;
                    break; // Erste Regel die fehlschlägt stoppt weitere
                }
            }
        });

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }
}
