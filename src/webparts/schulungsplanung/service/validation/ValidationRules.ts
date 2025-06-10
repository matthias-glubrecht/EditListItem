import { IValidationRule } from "./IValidationRule";

export const ValidationRules = {
    dateAfter: (targetFieldName: string, message: string): IValidationRule => ({
        validate: (value: Date, allValues: { [key: string]: any }) => {
            const targetDate = allValues[targetFieldName];
            if (!value || !targetDate) return { isValid: true, message: '' };

            return {
                isValid: value > targetDate,
                message: value <= targetDate ? message : ''
            };
        }
    }),

    required: (message: string): IValidationRule => ({
        validate: (value: any) => ({
            isValid: value != null && value !== '',
            message: !value ? message : ''
        })
    }),

    requiredDependsOn: (dependsOnFieldName: string, message: string): IValidationRule => ({
        validate: (value: any, allValues: {[key: string]: any}) => {
            const dependsOnValue = allValues[dependsOnFieldName];
            if (dependsOnValue) {
                return {
                    isValid: !!value,
                    message: !value ? message : ''
                };
            } else {
                return {
                    isValid: true,
                    message: ''
                };
            }
        }
    })
};