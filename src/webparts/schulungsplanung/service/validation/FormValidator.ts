import { IValidationResult } from "./IValidationResult";
import { IValidationRule } from "./IValidationRule";

export class FormValidator {
    private rules: { [key: string]: IValidationRule[] } = {};
    private values: { [key: string]: any } = {};

    public addRule(fieldName: string, rule: IValidationRule): void {
        if (!this.rules[fieldName]) {
            this.rules[fieldName] = [];
        }
        this.rules[fieldName].push(rule);
    }

    public setValue(fieldName: string, value: any): void {
        this.values[fieldName] = value;
    }

    public validate(): IValidationResult {
        const errors: { [key: string]: string } = {};

        Object.keys(this.rules).forEach(fieldName => {
            const fieldRules = this.rules[fieldName];
            const fieldValue = this.values[fieldName];

            for (const rule of fieldRules) {
                const result = rule.validate(fieldValue, this.values);
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
