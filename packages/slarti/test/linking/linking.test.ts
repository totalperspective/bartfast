import { afterEach, beforeAll, describe, expect, test } from "vitest";
import { EmptyFileSystem, type LangiumDocument } from "langium";
import { expandToString as s } from "langium/generate";
import { clearDocuments, parseHelper } from "langium/test";
import { createSlartiServices } from "../../src/language/slarti-module.js";
import { Model, isModel } from "../../src/language/generated/ast.js";
import { nodeNames } from "../string.js";

let services: ReturnType<typeof createSlartiServices>;
let parse:    ReturnType<typeof parseHelper<Model>>;
let document: LangiumDocument<Model> | undefined;

beforeAll(async () => {
    services = createSlartiServices(EmptyFileSystem);
    parse = parseHelper<Model>(services.Slarti);

    // activate the following if your linking test requires elements from a built-in library, for example
    // await services.shared.workspace.WorkspaceManager.initializeWorkspace([]);
});

afterEach(async () => {
    document && clearDocuments(services.shared, [ document ]);
});

const tests = [
    {
        name: 'terms in tokens',
        code: `
        token Test

        token TestTerm {
            term Term[Test]
        }
        `,
        expectation: s`
        Test
        TestTerm[Term[Test->Test]]
    `
    },
    {
        name: 'applying a principle',
        code: `
        token T
        principle P1 {
            relation testRel[T,T]
        }

        principle P2 {
            term T1[T]
            apply P1 {
                testRel -> T, T1
            }
        }
        `,
        expectation: s`
        T
        P1[testRel[T->T, T->T]]
        P2[T1[T->T], [P1->P1, [testRel->testRel, [T->T], [T1->T1]]]]
    `
    },
    {
        name: 'requiring a principle',
        code: `
        token T
        principle P1 {
            relation test[T,T]
        }

        principle P2 {
            require P1
        }
        `,
        expectation: s`
        T
        P1[test[T->T, T->T]]
        P2[P1[test[T->T, T->T]]]
    `
    },
    {
        name: 'requiring a principle in a language',
        code: `
        language L {
            token T
            principle P1 {
                relation test[T,T]
            }

            principle P2 {
                require P1
            }

            principle P3 {
                apply P2.P1 {}
            }
        }`,
        expectation: s`
        L[T, P1[test[T->T, T->T]], P2[P1[test[T->T, T->T]]], P3[[P2.P1->P1]]]
    `
    },
    {
        name: 'applying a required a principle in a language',
        code: `
        language L {
            token T
            principle P1 {
                relation test[T,T]
            }

            principle P2 {
                require P1
            }

            principle P3 {
                term A[T]
                apply P2.P1 {
                    test -> A, A
                }
            }
        }`,
        expectation: s`
        L[T, P1[test[T->T, T->T]], P2[P1[test[T->T, T->T]]], P3[A[T->T], [P2.P1->P1, [test->test, [A->A], [A->A]]]]]
    `
    }
]

describe('Linking tests', () => {

    test.each(tests)('linking of $name', async ({ code, expectation}) => {
        document = await parse(code);

        expect(
            // here we first check for validity of the parsed document object by means of the reusable function
            //  'checkDocumentValid()' to sort out (critical) typos first,
            // and then evaluate the cross references we're interested in by checking
            //  the referenced AST element as well as for a potential error message;
            checkDocumentValid(document)
                || document.parseResult.value.elements.map(n => nodeNames(n, true)).join('\n')
        ).toBe(expectation);
    });
});

function checkDocumentValid(document: LangiumDocument): string | undefined {
    return document.parseResult.parserErrors.length && s`
        Parser errors:
          ${document.parseResult.parserErrors.map(e => e.message).join('\n  ')}
    `
        || document.parseResult.value === undefined && `ParseResult is 'undefined'.`
        || !isModel(document.parseResult.value) && `Root AST object is a ${document.parseResult.value.$type}, expected a '${Model}'.`
        || undefined;
}
