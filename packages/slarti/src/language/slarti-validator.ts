import type { ValidationAcceptor, ValidationChecks } from 'langium';
import type { Relation, SlartiAstType, Token } from './generated/ast.js';
import type { SlartiServices } from './slarti-module.js';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: SlartiServices) {
  const registry = services.validation.ValidationRegistry;
  const validator = services.validation.SlartiValidator;
  const checks: ValidationChecks<SlartiAstType> = {
    Token: validator.checkTokenStartsWithCapital,
    Relation: validator.checkRelartionStartsWithNonCapital,
  };
  registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class SlartiValidator {
  checkTokenStartsWithCapital(token: Token, accept: ValidationAcceptor): void {
    if (token.name) {
      const firstChar = token.name.substring(0, 1);
      if (firstChar.toUpperCase() !== firstChar) {
        accept('warning', 'Token name should start with a capital.', {
          node: token,
          property: 'name',
        });
      }
    }
  }
  checkRelartionStartsWithNonCapital(
    rel: Relation,
    accept: ValidationAcceptor
  ): void {
    if (rel.name) {
      const firstChar = rel.name.substring(0, 1);
      if (firstChar.toLowerCase() !== firstChar) {
        accept('warning', 'Relation name should start with a non-capital.', {
          node: rel,
          property: 'name',
        });
      }
    }
  }
}
