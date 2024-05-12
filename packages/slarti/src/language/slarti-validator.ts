import type { ValidationAcceptor, ValidationChecks } from 'langium';
import type { SlartiAstType, Person } from './generated/ast.js';
import type { SlartiServices } from './slarti-module.js';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: SlartiServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.SlartiValidator;
    const checks: ValidationChecks<SlartiAstType> = {
        Person: validator.checkPersonStartsWithCapital
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class SlartiValidator {

    checkPersonStartsWithCapital(person: Person, accept: ValidationAcceptor): void {
        if (person.name) {
            const firstChar = person.name.substring(0, 1);
            if (firstChar.toUpperCase() !== firstChar) {
                accept('warning', 'Person name should start with a capital.', { node: person, property: 'name' });
            }
        }
    }

}
