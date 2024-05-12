# Bartfast

[![npm package][npm-img]][npm-url]
[![Build Status][build-img]][build-url]
[![Downloads][downloads-img]][downloads-url]
[![Issues][issues-img]][issues-url]
[![Code Coverage][codecov-img]][codecov-url]
[![Commitizen Friendly][commitizen-img]][commitizen-url]
[![Semantic Release][semantic-release-img]][semantic-release-url]

## Introduction

Bartfast is a design language builder inspired by Douglas Adams’ character Slartibartfast, a planet designer from the novel The Hitchhiker's Guide to the Galaxy. Much like Slartibartfast, who took immense pride in crafting detailed, award-winning coastlines, Bartfast aims to aid developers and designers in meticulously designing and refining their digital environments.

In the words of Slartibartfast himself, "I'd far rather be happy than right any day." This sentiment encapsulates Bartfast's philosophy of prioritizing user experience and design satisfaction over rigid adherence to technical correctness.

Bartfast emphasizes clarity, modularity, and reusability, allowing design languages to evolve organically while maintaining consistency across various components and applications.

## Embracing a Unique Design Language

While libraries offer quick solutions, embracing a separate Domain-Specific Language (DSL) like Bartfast adds a touch of creativity and flexibility to your design process. Instead of relying on off-the-shelf solutions, a DSL empowers you to craft bespoke design languages that resonate with your project's vision.

### Tailoring to Your Vision:
By using Bartfast, you're not just implementing a design library; you're sculpting a language that speaks to your project's unique needs. This approach fosters innovation and creativity, allowing you to break free from conventional design constraints and unleash your team's full potential.

### Bridging Creativity and Technicality:
A separate DSL bridges the gap between creativity and technicality, enabling designers and developers to collaborate seamlessly. With Bartfast, you can define design principles and tokens in a language that's both expressive and practical, fostering a harmonious workflow and driving towards design excellence.

Choosing a separate DSL over a library isn't just about functionality—it's about embracing a mindset prioritising creativity, collaboration, and the pursuit of design perfection.

## Key Approaches in Bartfast

Bartfast is designed with several high-level approaches to ensure flexibility, modularity, and ease of use. These approaches shape the core principles of the design language system and guide its implementation:

### Declarative and Incremental Definition:
Bartfast adopts a declarative and incremental approach to design language definition, allowing designers to express their intentions clearly and build languages incrementally, token by token. By declaratively defining design elements and principles, users can focus on the "what" rather than the "how," promoting readability, maintainability, and iterative development.

### Composable, Extensible, and Serializable:
Bartfast promotes composability, extensibility, and serializability at various levels, enabling designers to compose, extend, and serialize individual tokens, principles, and entire design languages. This flexibility empowers teams to tailor Bartfast to their needs, seamlessly integrating prebuilt libraries and serializing design languages as values. Bartfast fosters a modular and adaptable ecosystem by allowing customisation at granular levels.

### Graph-Based Representation:
Bartfast employs a graph-based internal representation, facilitating pattern matching and graph traversal for defining higher-level design concepts. This approach enables sophisticated querying and manipulation of design elements, empowering users to create complex design systems with ease and efficiency.

### Framework Agnosticism:
Bartfast is completely agnostic to target frameworks, dialects, UI libraries, and CSS frameworks, seamlessly integrating into various tech stacks. This framework-agnostic approach provides a universal solution for design language management, ensuring compatibility and interoperability across different development environments.

### Pluggable Architecture:
Bartfast features a pluggable architecture, with generators as the primary plugin used. These generators enable the seamless integration of various outputs, from TypeScript types and JSON schema to class lists for a component and Figma files. This extensibility allows users to customize Bartfast to their specific requirements, effortlessly integrate with external tools and systems, and tailor the workflow to suit their preferences.

### Documentation-First Approach:
Documentation is prioritized in Bartfast, supporting annotations that describe various aspects of the design language, including documentation, types, and other relevant information. These annotations ensure that design elements are well-documented and easily understandable by all stakeholders, promoting clarity and transparency throughout the design process. By integrating annotations directly into the definition, Bartfast streamlines the documentation workflow, making it an integral part of the design language development process.

## Introducing Bartfast's DSL: Simplicity and Expressiveness

Bartfast's Domain-Specific Language (DSL) embodies simplicity and expressiveness. It is distilled into two foundational concepts: Design Tokens and Design Principles. Despite its minimalist approach, this DSL empowers designers and developers to create robust design systems easily.

### Design Tokens:
At the core of Bartfast's DSL are Design Tokens, representing fundamental design values such as colours, typography, spacing, and more. These tokens serve as the elemental building blocks of the design language, providing a concise and versatile vocabulary for expressing design elements. Design Tokens can also be aggregated to form more complex concepts, enabling designers to encapsulate intricate design details within a single token.

### Design Principles:
Complementing Design Tokens are Design Principles encapsulating the system's design application rules and guidelines. These principles articulate fundamental design philosophies, ensuring consistency, accessibility, and aesthetic coherence across all components. By adhering to Design Principles, designers maintain clarity and purpose in their design decisions, fostering a cohesive and intuitive user experience.

Design Tokens and Design Principles are the cornerstone of Bartfast's DSL, offering a streamlined yet powerful framework for designing and refining digital environments. With its emphasis on simplicity and expressiveness, Bartfast empowers teams to create design systems that are elegant in conception and impactful in execution.

## The Slarti DSL

### Metadata
Metadata can be added to nearly all the concepts in Bartfast via tags and are expressed in Slarti using the `:keyword value` syntax anywhere in the concept body.

#### Intro Tag
The `:intro` tag provides a brief introduction to the purpose or functionality of a DSL construct.

#### Detail Tag
The `:detail` tag offers a more detailed explanation of the DSL construct, providing additional context or information.

#### Summary Tag
The `:summary` tag summarizes the essential characteristics or features of a DSL construct concisely.

### Languages
#### Starting a language
To begin defining a new language in Bartfast's DSL, use the following syntax:
```clj
language {LanguageName}
  :intro "Brief introduction to the language."
  :detail "Detailed description of the language."
```

### Tokens
Tokens are fundamental components within your language, serving as building blocks for defining various concepts and data structures. They can be defined independently or as aggregates composed of multiple terms.

#### Defining Tokens
To define a standalone token:
```clj
token {TokenName}
  :summary "Summary of the token's purpose."
  :detail "Detailed description of the token's functionality."
```

#### Defining Aggregates with Terms
Aggregates tokens collect related data or concepts using individual terms:

```clj
token {AggregateName}
  :summary "Summary of the aggregate's purpose."
  :detail "Detailed description of the aggregate's functionality."

term {TermName1}{AggregateName}
  :summary "Summary of the term's purpose within the aggregate."

term {TermName2}{AggregateName}
  :summary "Summary of another term's purpose within the aggregate."
```

Defining aggregates with terms allows for structured organization and representation of complex data structures within your language.

### Principle Satisfaction Syntax

To indicate that a token satisfies a particular principle, the following syntax is used:

```clj
token {TokenName}
  satisfies {PrincipleName}
```

This statement signifies that the token `{TokenName}` aligns with the guidelines or rules specified by the principle `{PrincipleName}`. It establishes a clear link between the token's definition and the overarching design principles within the DSL.

#### Principles
Principles encapsulate design guidelines or rules within a DSL.
```clj
principle {PrincipleName}
  :intro "Brief introduction to the principle."
  :summary "Summary of the principle's purpose."
```

##### Terms
Terms define individual components or attributes within a principle.
```clj
term {TermName}[{TokenName}]
  :summary "Summary of the term's purpose."
```

##### Relations
Relations establish connections or dependencies between terms within a principle.
```clj
relation {RelationName}[{Term | TokenName}, {Term | TokenName}]
  :summary "Summary of the relation's purpose."
```

##### As Relation
The `as` relation is a special one that allows the principle to be used as a relation when applying principles.
```clj
as [{Term | TokenName}, {Term | TokenName}]
```

#### Applying Principles
To apply principles within a specification, utilize the following syntax:
```clj
apply {PrincipleName}
  {RelationName} -> {Term}, {Term}
  {AnotherRelationName} -> {Term}, {Term}
  {AdditionalRelationName} -> {Term}, {Term}
```

#### Principle Satisfaction
Principles can require other principles, indicating dependencies or the aggregation of design guidelines.
```clj
principle {PrincipleName}
  require {OtherPrincipleName}
```

### Specification
#### Starting a Specification
Initiate a specification by referencing the desired language:
```clj
specify {SpecificationName}
  :intro "Brief introduction to the specification."
```

#### Using Languages
Incorporate previously defined languages into the specification:
```clj
use {LanguageName}
```

#### Token Instances
Define instances of tokens within the specification, specifying their values:
```clj
{tokenInstanceName} <- {TokenName}
  ; Definiton
```

##### Bindings
Assign values to individual terms within token instances:
```clj
{Term} -> {Value}
{AnotherTerm} -> {AnotherValue}
```

##### Applying Principles
Apply principles within the specification, binding specific terms to relations:
```clj
apply {PrincipleName}
  {RelationName} -> {Term}, {Term}
  {AnotherRelationName} -> {Term}, {Term}
```

### Using Dotted Notation
Bartfast's DSL supports dotted notation for referencing nested DSL constructs, providing a hierarchical structure for organizing and accessing elements within a language.

For example, to reference a token `TokenName` defined within the language `LanguageName`, use the following syntax:
```clj
LanguageName.TokenName
```

This notation allows for clear and concise referencing of elements within complex DSL structures, enhancing readability and maintainability of specifications.

### Term Definitions

Terms within a DSL provide granularity and specificity, defining individual components or attributes within principles, tokens, or relations. They play a crucial role in structuring and organizing the DSL's concepts. Here, we discuss various types of term definitions commonly used in DSLs.

#### Basic Terms
Basic terms define single components or attributes within a DSL construct. They are straightforward and represent atomic units of data or concepts.

```clj
term {TermName}[{TokenName}]
```
This syntax defines a basic term named `{TermName}` within the context of the token `{TokenName}`. It represents a single component or attribute associated with the specified token.

#### Using Tokens as Term Names
In some cases, it's beneficial to use tokens as term names, especially when the term represents a specific instance or property defined by the token.

```clj
term [{TermTokenName}][{ValueTokenName}]
```
Here, the term `{TermTokenName}` is defined using the token `{ValueTokenName}` as its name. This usage is particularly useful when the term encapsulates a value defined by another token.

#### Union Terms
Union terms allow for flexibility by encompassing multiple token options within a single term. This enables the term to represent a variety of concepts or attributes.

```clj
term {UnionTermName}[{TokenNameA} | {TokenNameB}]
```
In this example, the term `{UnionTermName}` is defined as a union of `{TokenNameA}` and `{TokenNameB}`. It can represent attributes that align with either of the specified tokens.

#### List Terms
List terms facilitate the representation of collections or sequences of data within a DSL. They allow for the aggregation of multiple instances or values.

```clj
term {ListTermName}[{TokenName}...]
```
Here, `{ListTermName}` represents a list of instances or values associated with the token `{TokenName}`. The ellipsis (...) indicates that multiple occurrences of the specified token can be included within the list.

## Sample Language Definition

Bartfast uses a structured language to define tokens and principles that guide the design process. Here is an example of how color principles are integrated:

```clj
language Colour {
  :intro "Defines color design principles and tokens for creating cohesive and accessible digital environments."
  :detail "Colour is a comprehensive framework designed for the creation and management of visual design elements. It encapsulates principles and tokens to address aesthetic harmony, accessibility, and usability within digital products."

  token Value {
    :summary "Defines the spectrum of colors used in UI elements and backgrounds."
    :detail "Value is a fundamental token in the Colour framework. It represents the range of visual colors used across the design system, ensuring a cohesive visual experience."
  }

  principle Harmony {
    :intro "Principle focusing on harmonious color combinations."
    :summary "Provides rules for combining colors to create visually appealing palettes."
    relation complements[Value, Value] {
      :intro "Defines complementary color pairs."
      :detail "Complementary colors are pairs of colors that, when combined, cancel each other out, creating a neutral color."
    }
    relation analogous[Value, Value] {
      :intro "Defines analogous color pairs."
      :detail "Analogous colors are colors that are adjacent to each other on the color wheel"
    }
    relation triadic[Value, Value, Value] {
      :intro "Defines combinations of triadic colors."
      :detail "Triadic colors are sets of three colors that are evenly spaced around the color wheel, creating balanced and vibrant color schemes."
    }
    relation splitComplementary[Value, [Value, Value]] {
      :intro "Defines combinations of split complementary colors."
      :detail "Split complementary colors are pairs of colors that are adjacent to a complementary color, providing both contrast and harmony."
      complements -> $Object, $Subject*
    }
 }

  principle Context {
    :intro "Principle focusing on the context of color perception."
    :summary "Considers environmental factors affecting color perception."
    relation contrastEnhancement[Value, Value]
    relation environmentImpact[Value, Value]
  }

  principle Theory {
    :intro "Color theory principles for harmonious color combinations."
    :summary "Guides aesthetically pleasing color combinations."
    require Harmony
    require Context
  }
  principle HighContrast {
    :summary "Enhances interface accessibility by providing sufficient contrast between foreground and background elements."
    :detail "HighContrast focuses on enhancing the visual accessibility of interfaces by ensuring a sufficient contrast ratio between foreground and background elements."
    term Foreground[Value] {
      :summary "Specifies the color used for critical interactive elements like text and icons."
    }
    term Background[Value] {
      :summary "Specifies the color used for larger background areas, ensuring they contrast effectively with foreground elements."
    }
    as [Foreground, Background]
    relation highContrast[Foreground, Background] {
      :summary "Verifies that the chosen foreground and background colors meet accessibility standards for contrast."
    }
  }
  principle ColorBlindSafe {
      :summary "Optimizes color selections to be distinguishable by users with color vision deficiencies."
      :detail "ColorBlindSafe enhances usability for users with color vision deficiencies by optimizing color choices that are distinguishable across various types of color blindness."
    term Foreground[Value] {
      :summary "Color designated for important UI components requiring immediate attention."
    }
    term Background[Value] {
      :summary "Color used for less interactive elements that must still be visible."
    }
    as [Foreground, Background]
    relation colorBlindSafe[Foreground, Background] {
      :summary "Confirms that foreground and background colors are perceptible by users with different types of color blindness."
    }
  }
  principle Accessibility {
    :summary "Combines HighContrast and ColorBlindSafe principles to accommodate a wider range of visual abilities."
    :detail "Accessibility combines the HighContrast and ColorBlindSafe principles to form a comprehensive approach to visual accessibility, ensuring that all users can navigate and understand interfaces effectively."
    require HighContrast
    require ColorBlindSafe
  }

  principle Theme {
    :summary "Establishes essential color guidelines for user interfaces."
    :detail "Theme sets foundational color guidelines to create coherent and aesthetically pleasing user interfaces."

    term Background[Value] {
      :summary "Main color for interface backgrounds."
    }
    term Text[Value] {
      :summary "Color for all text elements to ensure readability."
      }
    term Primary[Value] {
      :summary "Dominant color used for primary actions and highlights."
    }
    term Secondary[Value] {
      :summary "Supplementary color that supports the primary palette."
    }
    apply Accessibility.Theory {
      complements -> Primary, Secondary
      analogous -> Primary, Background
      triadic -> Primary, Secondary, Text
      splitComplementary -> Background, [Secondary, Primary]
    }
    apply Accessibility {
      :doc "Applies color accessibility principles to ensure readability and usability."
      HighContrast -> Text, Background {
        :doc "Ensures sufficient contrast between text and background colors."
      }
      ColorBlindSafe -> Primary, Secondary {
        :doc "Optimizes color choices for users with color vision deficiencies."
      }
    }
  }
  token Name
    :summary "Identifies specific colors within the design system for consistent application."
    :detail "Name serves as a naming convention for systematic use within the design system. Each Name is associated with a specific color defined under the Value token, promoting consistency throughout the design elements."

  token Palette
    :summary "Organizes a set of named colors to ensure consistency across UI components."
    :detail "Palette serves as a structured repository within the Colour framework, systematically organizing a collection of named colors. This token facilitates the consistent application of color across various design elements, maintaining coherence and supporting thematic consistency."
    term [Name][Value] {
      :summary "This mapping defines specific visual colors associated with named color identifiers within the design system. Each entry in the Palette represents a named color that is directly linked to a defined visual color in the Value token, ensuring consistency across the design system."
    }
    satisfies Theory
}
```

## Example Theme Instances

To demonstrate how Bartfast can be applied to define specific themes within a design system, consider the following examples:

```clj
specify MyBrand {
  :intro "This file defines a color palette and themes using the Colour DSL."
  use Colour

  myPalette <- Colour.Palette {
    :intro "Defines a palette of colors for the design language."
    :detail "The palette includes a range of colors to be used consistently throughout the design system."
    White -> #FFFFFF
    Black -> #000000
    DarkGrey -> #333333
    Blue -> #0066CC
    LightBlue -> #0099FF
    Grey -> #AAAAAA
    Red -> #FF0000
    Green -> #00FF00
    Yellow -> #FFFF00
    Orange -> #FFA500
    Purple -> #800080
    Pink -> #FFC0CB
    apply Colour.Theory.Harmony {
      :intro "Complementary colours"
      complements -> Blue, Orange
      complements -> Red, Green
      complements -> Orange, Purple
    }
    apply Colour.Theory.Harmony {
      :intro "Analogous colours"
      analogous -> Blue, LightBlue
      analogous -> Red, Yellow
      analogous -> Orange, Yellow
      analogous -> Purple, Pink
    }
    apply ColorTheory.Harmony {
      :intro "Triadic colours"
      triadic -> Red, Green, Blue
      triadic -> Green, Blue, Yellow
      triadic -> Purple, Pink, Orange
    }
    apply ColorTheory.Harmony {
      :intro "Split complementary colours"
      splitComplementary -> Green, LightBlue, Red
      splitComplementary -> Yellow, Blue, Red
      splitComplementary -> Pink, Yellow, Red
    }
    apply ColorTheory.Context {
      :intro "Contextual colours"
      contrastEnhancement -> White, Black
      environmentImpact -> Grey, DarkGrey
      environmentImpact -> White, DarkGrey
      environmentImpact -> Black, White
      environmentImpact -> LightBlue, DarkGrey
      environmentImpact -> DarkGrey, White
      environmentImpact -> Black, LightBlue
    }
  }

  LightTheme <- Colour.Theme {
    :intro "Defines a light theme with specific color values."
    :detail "The light theme establishes a bright and airy visual style suitable for well-lit environments."
    Background -> myPalette.White
    Text -> myPalette.DarkGrey
    Primary -> myPalette.Blue
    Secondary -> myPalette.LightBlue
  }

  DarkTheme <- Colour.Theme {
    :intro "Defines a dark theme with specific color values."
    :detail "The dark theme creates a sleek and modern visual style ideal for low-light environments."
    Background -> myPalette.DarkGrey
    Text -> myPalette.White
    Primary -> myPalette.Red
    Secondary -> myPalette.Green
  }
}
```

## Conclusion

Bartfast is designed to be a foundational tool for creating, managing, and evolving your design system. With its emphasis on detailed design principles and modular structure, it allows design teams to craft environments that are not only visually appealing but also functionally tailored to meet diverse user needs.

Implemented using https://langium.org/
