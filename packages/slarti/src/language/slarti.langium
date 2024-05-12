grammar Slarti

entry Model:
    elements+=Element*
;

Element:
    Language | Token | Principle | Specification | Use | Instance
;

Language:
    'language' name=ID
    ( '{' (metadata+=Metadata | tokens+=Token | principles+=Principle)* '}' )?
;

Token:
    'token' name=ID
    ( '{' (metadata+=Metadata | terms+=Term | satisfies+=PrincipleReference)* '}' )?
;

Principle:
    'principle' name=ID
    ( '{' (metadata+=Metadata | terms+=Term | relations+=Relation | as=AsRelation | applies+=Apply)* '}' )?
;

Term:
    'term' name=ID
    definition=TermDefinition
    ( '{' (metadata+=Metadata)* '}' )?
;

TermDefinition:
    BasicTerm | UnionTerm | ListTerm | TupleTerm
;

BasicTerm:
    type=QualifiedName
;

UnionTerm:
    types+=QualifiedName ('|' types+=QualifiedName)+
;

ListTerm:
    '[' type=QualifiedName '...' ']'
;

TupleTerm:
    '[' types+=QualifiedName (',' types+=QualifiedName)+ ']'
;

Relation:
    'relation' name=ID '[' subject=ExtendedTerm<false, false> ',' object=ExtendedTerm<false, true> ']'
    ( '{' (subRelations+=SubRelation | metadata+=Metadata)* '}' )?
;

SubRelation infers Application:
    relation=ID '->' subject=ExtendedTerm<true, false> ',' object=ExtendedTerm<true, false>
;

ExtendedTerm<isShadow, allowTuples>:
    (<isShadow> term=ShadowName | term=QualifiedName | <allowTuples> term=TermTuple) index=IndexSuffix?
;

TermTuple:
    '[' terms+=QualifiedName (',' terms+=QualifiedName)* ']'
;

ShadowName returns string:
    '$' ('Object' | 'Subject')
;

IndexSuffix:
    ('/' index=INT) | index='*'
;

AsRelation:
    'as' '[' subject=QualifiedName ',' object=QualifiedName ']'
    ( '{' (metadata+=Metadata)* '}' )?
;

Apply:
    'apply' principle=QualifiedName
    ( '{' (applications+=Application | metadata+=Metadata)* '}' )?
;

Application:
    relation=QualifiedName '->' subject=ExtendedTerm<false, false> ',' object=ExtendedTerm<false, false>
;

Specification:
    'specify' name=ID
    ( '{' (metadata+=Metadata | uses+=Use | instances+=Instance | applies+=Apply)* '}' )?
;

Use:
    'use' language=QualifiedName
;

Instance:
    name=ID '<-' token=QualifiedName
    ( '{' (metadata+=Metadata | bindings+=Binding | applies+=Apply)* '}' )?
;

Binding:
    term=ID '->' value=Value
;

Metadata:
    ':' key=ID value=STRING
;

PrincipleReference:
    'satisfies' principle=QualifiedName
;

TaggedLiteral:
    '#' tag=ID literal=Literal
;

Value:
    Literal | TaggedLiteral
;

QualifiedName returns string:
    ID ('.' ID)*
;

Literal:
    value=(INT | STRING) | Vector | BOOLEAN | 'null'
;

fragment Vector:
    '[' value+=Literal (',' value+=Literal)* ']'
;

fragment BOOLEAN:
    value?='true' | 'false'
;

terminal ID: /[_a-zA-Z][\w_]*/;
terminal INT returns number: /[0-9]+/;
terminal STRING: /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/;

hidden terminal SL_COMMENT: /;[^\n\r]*/;
hidden terminal WS: /\s+/;
