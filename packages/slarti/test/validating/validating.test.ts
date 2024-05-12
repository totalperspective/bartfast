import { beforeAll, describe, expect, test } from "vitest";
import { EmptyFileSystem, type LangiumDocument } from "langium";
import { expandToString as s } from "langium/generate";
import { parseHelper } from "langium/test";
import type { Diagnostic } from "vscode-languageserver-types";
import { createSlartiServices } from "../../src/language/slarti-module.js";
import { Model, isModel } from "../../src/language/generated/ast.js";

let services: ReturnType<typeof createSlartiServices>;
let parse: ReturnType<typeof parseHelper<Model>>;
let document: LangiumDocument<Model> | undefined;

beforeAll(async () => {
    services = createSlartiServices(EmptyFileSystem);
    const doParse = parseHelper<Model>(services.Slarti);
    parse = (input: string) => doParse(input, { validation: true });

    // activate the following if your linking test requires elements from a built-in library, for example
    // await services.shared.workspace.WorkspaceManager.initializeWorkspace([]);
});

const tests = [
    {
        name: 'check no errors Token Name',
        code: `
        token TestToken
        `,
        expected: {
            length: 0
        }
    },
    {
        name: 'check capital letter validation Token Name',
        code: `
        token testToken
        `,
        expected: {
            content: s`
            [1:14..1:23]: Token name should start with a capital.
        `
        }

    },
    {
        name: 'check no errors Relation Name',
        code: `
        principle Test {
            relation test[A,B]
        }
        `,
        expected: {
            length: 0
        }
    },
    {
        name: 'check capital letter validation Relation Name',
        code: `
        principle Test {
            relation Test[A,B]
        }
        `,
        expected: {
            content: s`
            [2:21..2:25]: Relation name should start with a non-capital.
        `
        }

    }
]
describe('Validating', () => {

    test.each(tests)('$description', async ({ code, expected: expected }) => {
        document = await parse(code);

        const result = checkDocumentValid(document) || document?.diagnostics?.map(diagnosticToString)?.join('\n')
        for (const [type, expectation] of Object.entries(expected)) {
            switch (type) {
                case 'length':
                    expect(result).toHaveLength(expectation);
                    break;
                case 'content':
                    expect(result).toEqual(
                        // 'expect.stringContaining()' makes our test robust against future additions of further validation rules
                        expect.stringContaining(expectation)
                    )
                    break;
            }
        }
    });

    test('check capital letter validation', async () => {
        document = await parse(`
            token testToken
        `);

        expect(
            checkDocumentValid(document) || document?.diagnostics?.map(diagnosticToString)?.join('\n')
        ).toEqual(
            // 'expect.stringContaining()' makes our test robust against future additions of further validation rules
            expect.stringContaining(s`
                [1:18..1:27]: Token name should start with a capital.
            `)
        );
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

function diagnosticToString(d: Diagnostic) {
    return `[${d.range.start.line}:${d.range.start.character}..${d.range.end.line}:${d.range.end.character}]: ${d.message}`;
}
