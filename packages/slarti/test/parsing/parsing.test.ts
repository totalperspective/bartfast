import { beforeAll, describe, expect, test } from 'vitest';
import type { LangiumDocument } from 'langium'
import { AstNode, EmptyFileSystem } from 'langium';
import { expandToString as s } from 'langium/generate';
import { parseHelper } from 'langium/test';
import { createSlartiServices } from '../../src/language/slarti-module.js';
import { Model, isModel } from '../../src/language/generated/ast.js';
import { buildAstString } from './string.js';

let services: ReturnType<typeof createSlartiServices>;
let parse: ReturnType<typeof parseHelper<Model>>;
let document: LangiumDocument<Model> | undefined;

beforeAll(async () => {
    services = createSlartiServices(EmptyFileSystem);
    parse = parseHelper<Model>(services.Slarti);
});

const FAILS = Symbol('FAILS')
const tests = [
    {
        description: "Basic empty language structure",
        code: `language Empty {}`,
        structure: `
            Language(Empty):
        `
    },
    {
        description: "Language with metadata",
        code: `
            language MetadataExample {
                :intro "Introduction to Metadata Example"
                :detail "Detailed explanation of the Metadata Example usage."
            }
        `,
        structure: s`
            Language(MetadataExample):
              :intro "Introduction to Metadata Example"
              :detail "Detailed explanation of the Metadata Example usage."
        `
    },
    {
        description: "Token with descriptions",
        code: `
            language TokenLang {
                token ColorToken {
                    :summary "Represents basic color information"
                }
            }
        `,
        structure: s`
            Language(TokenLang):

              Tokens:
                Token(ColorToken):
                  :summary "Represents basic color information"
        `
    }
    ,
    {
        description: "Principle with relations",
        code: `
            language PrincipleLang {
                principle Harmony {
                    relation complements[Value, Value]
                }
            }
        `,
        structure: s`
            Language(PrincipleLang):

              Principles:
                Principle(Harmony):

                  Relations:
                    Relation(complements):
        `
    }
,
{
    description: "Complex relations with nested details",
    code: `
        language ComplexRelationLang {
            principle AdvancedColorTheory {
                relation triadic[Value, [Value, Value]] {
                    :detail "Triadic relation for vibrant color schemes."
                    shadow -> $Object, $Subject*
                }
            }
        }
    `,
    structure: s`
        Language(ComplexRelationLang):

          Principles:
            Principle(AdvancedColorTheory):

              Relations:
                Relation(triadic):
                  :detail "Triadic relation for vibrant color schemes."
    `
}

,
    {
        description: "Single language with token and principle",
        code: `
      language Example {
        token MyToken
          principle MyPrinciple
        }
      `,
        structure: s`
        Language(Example):

          Tokens:
            Token(MyToken):


          Principles:
            Principle(MyPrinciple):
      `
    },
    {
        description: "Multiple tokens and principles",
        code: `
        language AnotherExample {
          token FirstToken
          token SecondToken
          principle FirstPrinciple
          principle SecondPrinciple
        }
      `,
        structure: s`
        Language(AnotherExample):

          Tokens:
            Token(FirstToken):

            Token(SecondToken):


          Principles:
            Principle(FirstPrinciple):

            Principle(SecondPrinciple):
      `
    },
    {
        description: "Language with nested tokens",
        code: `
        language NestedExample {
          token TokenName
          token OuterToken {
              term InnerTerm TokenName
          }
        }
      `,
        structure: s`
        Language(NestedExample):

          Tokens:
            Token(TokenName):

            Token(OuterToken):

              Terms:
                Term(InnerTerm):
      `
    },
    {
        description: "Empty language",
        code: `
        language EmptyLanguage {}
      `,
        structure: s`
        Language(EmptyLanguage):
      `
    },
    {
        description: "Language with uses and specifications",
        code: `
        language UseExample {
          use OtherLanguage
          specify Spec {
              instance MyInstance <- MyToken
          }
        }
      `,
        structure: FAILS
    },
    {
        description: "Specification with basic use",
        code: `
            specify BasicUse {
                :intro "Basic specification using another DSL component."
                use Colour
            }
        `,
        structure: s`
            Specification(BasicUse):
              :intro "Basic specification using another DSL component."

              Uses:
                Use(Colour):
        `
    },
    {
        description: "Specification with instances and detailed metadata",
        code: `
            specify DetailedSpec {
                :intro "Defines specific instances for testing."
                myInstance <- Colour.Palette {
                    :intro "Palette instance for detailed specification."
                }
            }
        `,
        structure: s`
            Specification(DetailedSpec):
              :intro "Defines specific instances for testing."
        
              Instances:
                Instance(myInstance):
                  :intro "Palette instance for detailed specification."
        `
    },
    {
        description: "Complex specification with multiple applications",
        code: `
            specify ComplexApplication {
                use Colour
                myTheme <- Colour.Theme {
                    apply Colour.Theory.Harmony {
                        complements -> Red, Green
                    }
                    apply Colour.Theory.Context {
                        contrastEnhancement -> White, Black
                    }
                }
            }
        `,
        structure: s`
            Specification(ComplexApplication):

              Uses:
                Use(Colour):

              Instances:
                Instance(myTheme):

                  Applies:
                    Apply(Colour.Theory.Harmony):

                    Apply(Colour.Theory.Context):
        `
    },
    {
        description: "Specification with nested themes and color bindings",
        code: `
            specify ThemeSpecification {
                LightTheme <- Colour.Theme {
                    :intro "Light theme specifications."
                    Background -> #colour "#FFFFFF"
                    Text -> #colour "#333333"
                }
                DarkTheme <- Colour.Theme {
                    :intro "Dark theme specifications."
                    Background -> #colour "#000000"
                    Text -> #colour "#FFFFFF"
                }
            }
        `,
        structure: s`
            Specification(ThemeSpecification):

              Instances:
                Instance(LightTheme):
                  :intro "Light theme specifications."

                  Bindings:
                    Binding(Background):
                    Binding(Text):

                Instance(DarkTheme):
                  :intro "Dark theme specifications."

                  Bindings:
                    Binding(Background):
                    Binding(Text):
        `
    }
    
];


describe('AST structure tests', () => {
    test.each(tests)('Validate complex language structure - $description', async ({ code, structure }) => {
        document = await parse(code);

        // Pre-validate the document before making assertions on its structure
        const validationError = checkDocumentValid(document);
        if (structure === FAILS) {
            expect(validationError).toBeDefined();
            return
        }
        expect(validationError || '').toBe('');

        const formattedAst = buildAstString(document.parseResult.value, services).trim();

        // Perform the structure comparison
        expect(formattedAst).toBe((structure as string).trim());
    });
});


/**
 * Checks if the document is valid and returns an error message if not.
 * @param document The Langium document to validate.
 * @returns A string describing the issue if the document is invalid, otherwise undefined.
 */
function checkDocumentValid(document: LangiumDocument<Model>): string | undefined {
    if (!document || document.parseResult.parserErrors.length > 0) {
        return `Parser errors:\n${document.parseResult.parserErrors.map(e => e.message).join('\n')}`;
    }
    if (!document.parseResult.value) {
        return "ParseResult is 'undefined'.";
    }
    if (!isModel(document.parseResult.value)) {
        const node: AstNode = document.parseResult.value
        return `Root AST object is a ${node.$type}, expected a 'Model'.`;
    }
    return undefined;
}
