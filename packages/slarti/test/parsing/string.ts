import { AstNode, isNamed, isReference, Reference } from 'langium';
import {
  isLanguage,
  isToken,
  isPrinciple,
  isSpecification,
  isUse,
  isInstance,
  isModel,
  isMetadata,
  isApply,
  isBinding,
  isMeta,
} from '../../src/language/generated/ast.js';
import { createSlartiServices } from '../../src/language/slarti-module.js';

/**
 * Recursively builds a formatted string from the AST nodes.
 * @param node The root AST node from which to start formatting.
 * @param services Langium services, used for accessing AST reflection data.
 * @param depth Current depth in the AST, used for indentation.
 * @returns A formatted string representing the AST structure.
 */
export function buildAstString(
  node: AstNode,
  services: ReturnType<typeof createSlartiServices>,
  depth: number = 0
): string {
  const indent = ' '.repeat(depth * 2); // Adjust indentation level

  function nodeName(node: AstNode | Reference<AstNode>) {
    if (isReference(node)) {
      if (node.error) {
        return node.$refText;
      }
      return nodeName(node.ref!);
    }
    if (isApply(node)) {
      return nodeName(node.principle);
    }
    if (isUse(node)) {
      return nodeName(node.language);
    }
    if (isBinding(node)) {
      return nodeName(node.term);
    }

    if (isNamed(node)) {
      return node.name;
    }
    return '';
  }
  let result = !isModel(node)
    ? isMetadata(node)
      ? `${indent}:${node.key} "${node.value}"\n`
      : `${indent}${node.$type}(${nodeName(node)}):\n`
    : '';

  // Helper function to process child nodes
  const processChildren = (children: AstNode[], step = 1) => {
    return children
      .map(child => buildAstString(child, services, depth + step))
      .join('');
  };

  if (isMeta(node))
    result += `${processChildren(
      node.metadata,
      isLanguage(node) || isSpecification(node) ? 0 : 1
    )}\n`;
  // Determine type of node and process accordingly
  if (isModel(node)) {
    result += `${indent}${processChildren(node.elements)}\n`;
  } else if (isLanguage(node)) {
    if (node.tokens.length)
      result += `${indent}Tokens:\n${processChildren(node.tokens)}\n`;
    if (node.principles.length)
      result += `${indent}Principles:\n${processChildren(node.principles)}\n`;
  } else if (isToken(node)) {
    if (node.terms.length)
      result += `${indent}  Terms:\n${processChildren(node.terms, 2)}\n`;
  } else if (isPrinciple(node)) {
    if (node.terms.length)
      result += `${indent}  Terms:\n${processChildren(node.terms, 2)}\n`;
    if (node.relations.length)
      result += `${indent}  Relations:\n${processChildren(
        node.relations,
        2
      )}\n`;
    if (node.applies.length)
      result += `${indent}  Applies:\n${processChildren(node.applies, 2)}\n`;
  } else if (isSpecification(node)) {
    if (node.uses.length)
      result += `${indent}Uses:\n${processChildren(node.uses)}\n`;
    if (node.instances.length)
      result += `${indent}Instances:\n${processChildren(node.instances)}\n`;
  } else if (isUse(node)) {
    // Uses may not have child elements that are parsed, but reflect imported aspects
  } else if (isInstance(node)) {
    if (node.bindings.length)
      result += `${indent}  Bindings:\n${processChildren(node.bindings, 2)}\n`;
    if (node.applies.length)
      result += `${indent}  Applies:\n${processChildren(node.applies, 2)}\n`;
  }

  return result;
}
