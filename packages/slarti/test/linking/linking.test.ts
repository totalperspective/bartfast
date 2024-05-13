import { afterEach, beforeAll, describe, expect, test } from "vitest";
import { EmptyFileSystem, type LangiumDocument, AstNode } from "langium";
import { expandToString as s } from "langium/generate";
import { clearDocuments, parseHelper } from "langium/test";
import { createSlartiServices } from "../../src/language/slarti-module.js";
import { Model, Token, isModel, isToken } from "../../src/language/generated/ast.js";
import { nodeName, nodeNames } from "../string.js";

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
            term Term Test
        }
        `,
        expectation: s`
        Test
        TestTerm[Term[->Test]]
    `
    },
    {
        name: 'applying a principle',
        code: `
        token T
        principle P1 {
            relation test[T,T]
        }

        principle P2 {
            term T1 T
            apply P1 {
                test -> T, T1
            }
        }
        `,
        expectation: s`
        T
        P1[test[->T, ->T]]
        P2[T1[->T], [->P1, [->test, [->T], [->T1]]]]
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
