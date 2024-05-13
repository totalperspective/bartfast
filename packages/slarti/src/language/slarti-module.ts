import { AstNode, AstNodeDescription, DefaultScopeComputation, LangiumDocument, type Module, MultiMap, PrecomputedScopes, inject, isNamed } from 'langium';
import { createDefaultModule, createDefaultSharedModule, type DefaultSharedModuleContext, type LangiumServices, type LangiumSharedServices, type PartialLangiumServices } from 'langium/lsp';
import { SlartiGeneratedModule, SlartiGeneratedSharedModule } from './generated/module.js';
import { SlartiValidator, registerValidationChecks } from './slarti-validator.js';
import { isLanguage, isModel, isNamespace, isPrinciple, isSpecification, isToken, Named, Namespace } from './generated/ast.js';

// Scope computation for our C++-like language
export class SlartiScopeComputation extends DefaultScopeComputation {

    constructor(services: LangiumServices) {
        super(services);
    }

    override async computeExports(document: LangiumDocument): Promise<AstNodeDescription[]> {
        const exportedDescriptions: AstNodeDescription[] = [];
        for (const childNode of this.getNamedElements(document.parseResult.value)) {
            if (isNamed(childNode)) {
                const fullyQualifiedName = this.getQualifiedName(childNode, childNode.name);
                // `descriptions` is our `AstNodeDescriptionProvider` defined in `DefaultScopeComputation`
                // It allows us to easily create descriptions that point to elements using a name.
                exportedDescriptions.push(this.descriptions.createDescription(childNode, fullyQualifiedName, document));
            }
        }
        return exportedDescriptions;
    }
    
    override async computeLocalScopes(document: LangiumDocument): Promise<PrecomputedScopes> {
        const model = document.parseResult.value as Namespace;
        // This map stores a list of descriptions for each node in our document
        const scopes = new MultiMap<AstNode, AstNodeDescription>();
        this.processContainer(model, scopes, document);
        return scopes;
    }

    private getNamedElements(container: AstNode): Named[] {
        if (isLanguage(container)) {
            return [...container.tokens, ...container.principles]
        }

        if (isSpecification(container)) {
            return [...container.instances]
        }

        if (isPrinciple(container)) {
            return [...container.relations, ...container.terms]
        }

        if (isToken(container)) {
            return [...container.terms]
        }

        if (isModel(container)) {
            return [...container.elements.filter(isNamed) as Named[]]
        }
        return []
    }

    private processContainer(
        container: Namespace, 
        scopes: PrecomputedScopes, 
        document: LangiumDocument
    ): AstNodeDescription[] {
        const localDescriptions: AstNodeDescription[] = [];
        for (const element of this.getNamedElements(container)) {
            if (isNamed(element)) {
                // Create a simple local name for the element
                const description = this.descriptions.createDescription(element, element.name, document);
                localDescriptions.push(description);
            }
            if (isNamespace(element)) {
                const nestedDescriptions = this.processContainer(element, scopes, document);
                for (const description of nestedDescriptions) {
                    // Add qualified names to the container
                    // This could also be a partial qualified name
                    const qualified = this.createQualifiedDescription(element, description, document);
                    localDescriptions.push(qualified);
                }
            }
        }
        scopes.addAll(container, localDescriptions);
        return localDescriptions;
    }

    private createQualifiedDescription(
        container: Namespace, 
        description: AstNodeDescription, 
        document: LangiumDocument
    ): AstNodeDescription {
        // `getQualifiedName` has been implemented in the previous section
        const name = this.getQualifiedName(container, description.name);
        return this.descriptions.createDescription(description.node!, name, document);
    }

    private getQualifiedName(node: AstNode, name: string): string {
        let parent: AstNode | undefined = node.$container;
        while (isNamespace(parent)) {
            // Iteratively prepend the name of the parent namespace
            // This allows us to work with nested namespaces
            name = `${parent.name}.${name}`;
            parent = parent.$container;
        }
        return name;
    }
}

/**
 * Declaration of custom services - add your own service classes here.
 */
export type SlartiAddedServices = {
    validation: {
        SlartiValidator: SlartiValidator
    }
}

/**
 * Union of Langium default services and your custom services - use this as constructor parameter
 * of custom service classes.
 */
export type SlartiServices = LangiumServices & SlartiAddedServices

/**
 * Dependency injection module that overrides Langium default services and contributes the
 * declared custom services. The Langium defaults can be partially specified to override only
 * selected services, while the custom services must be fully specified.
 */
export const SlartiModule: Module<SlartiServices, PartialLangiumServices & SlartiAddedServices> = {
    validation: {
        SlartiValidator: () => new SlartiValidator()
    },
    references: {
        ScopeComputation: (services) => new SlartiScopeComputation(services)
    }
};

/**
 * Create the full set of services required by Langium.
 *
 * First inject the shared services by merging two modules:
 *  - Langium default shared services
 *  - Services generated by langium-cli
 *
 * Then inject the language-specific services by merging three modules:
 *  - Langium default language-specific services
 *  - Services generated by langium-cli
 *  - Services specified in this file
 *
 * @param context Optional module context with the LSP connection
 * @returns An object wrapping the shared services and the language-specific services
 */
export function createSlartiServices(context: DefaultSharedModuleContext): {
    shared: LangiumSharedServices,
    Slarti: SlartiServices
} {
    const shared = inject(
        createDefaultSharedModule(context),
        SlartiGeneratedSharedModule
    );
    const Slarti = inject(
        createDefaultModule({ shared }),
        SlartiGeneratedModule,
        SlartiModule
    );
    shared.ServiceRegistry.register(Slarti);
    registerValidationChecks(Slarti);
    return { shared, Slarti };
}
