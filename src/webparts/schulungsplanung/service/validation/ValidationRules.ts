import { IValidationRule } from './IValidationRule';

// tslint:disable-next-line:variable-name
export const ValidationRules: { [key: string]: (...args: string[]) => IValidationRule } = {
    dateAfter: (targetFieldName: string, message: string): IValidationRule => ({
        validate: (value: {}, allValues: { [key: string]: {} }) => {
            const targetDate: {} = allValues[targetFieldName];
            if (!value || !targetDate) {
                return { isValid: true, message: '' };
            }

            return {
                isValid: (value as Date) > (targetDate as Date),
                message: (value as Date) <= (targetDate as Date) ? message : ''
            };
        }
    }),

    required: (message: string): IValidationRule => ({
        validate: (value: {}) => ({
            isValid: value !== undefined && value !== '',
            message: !value ? message : ''
        })
    }),

    requiredDependsOn: (dependsOnFieldName: string, message: string): IValidationRule => ({
        validate: (value: {}, allValues: {[key: string]: {}}) => {
            const dependsOnValue: {} = allValues[dependsOnFieldName];
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