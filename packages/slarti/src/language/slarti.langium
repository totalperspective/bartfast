grammar Slarti

entry Model:
    elements+=Element*
;

Element:
    Language | Token | Principle | Specification | Use | Instance
;

type Namespace = Language | Token | Principle | Specification;
type Named = Namespace | Term | Relation |  Instance
type NamedOrRefed = Named | Apply | Application | SubRelationSubject | TermRef | RelationTerms | SubRelationObject
type TermOrToken = Term | Token
type Meta = Named | AsRelation | Apply

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
    ( '{' (metadata+=Metadata | terms+=Term | relations+=Relation | as=AsRelation | applies+=Apply | requires+=Require)* '}' )?
;

Term:
    'term' name=ID
    '[' TermDefinition ']'
    ( '{' (metadata+=Metadata)* '}' )?
;

fragment TermDefinition:
    definition=(BasicTerm | UnionTerm | ListTerm | TupleTerm)
;

BasicTerm:
    term=[Token:QualifiedName]
;

UnionTerm:
    types+=[Token:QualifiedName] ('|' types+=[Token:QualifiedName])+
;

ListTerm:
    '[' type=[Token:QualifiedName] '...' ']'
;

TupleTerm:
    '[' types+=[Token:QualifiedName] (',' types+=[Token:QualifiedName])+ ']'
;

Relation:
    'relation' name=ID '[' subject=TermRef ',' object=RelationTerms ']'
    ( '{' (subRelations+=SubRelation | metadata+=Metadata)* '}' )?
;

SubRelation infers Application:
    relation=[Relation:ID] '->' subject=SubRelationSubject ',' object=SubRelationObject
;

RelationTerms:
    (TermRef index=IndexSuffix?) | TermTuple
;

SubRelationSubject:
    (TermRef | ShadowTerm) index=IndexSuffix?
;

SubRelationObject:
    ShadowTermTuple | SubRelationSubject
;

TermRef:
    term=[TermOrToken:QualifiedName]
;

ShadowTerm:
    term=ShadowName
;

TermTuple:
    '[' terms+=TermRef (',' terms+=TermRef)* ']'
;

ShadowTermTuple:
    '[' terms+=SubRelationSubject (',' terms+=SubRelationSubject)* ']'
;

ShadowName returns string:
    '$' ('Object' | 'Subject')
;

IndexSuffix:
    ('/' index=INT) | index='*'
;

AsRelation:
    'as' '[' subject=[TermOrToken:QualifiedName] ',' object=[TermOrToken:QualifiedName] ']'
    ( '{' (metadata+=Metadata)* '}' )?
;

Apply:
    'apply' principle=[Principle:QualifiedName]
    ( '{' (applications+=Application | metadata+=Metadata)* '}' )?
;

Application:
    relation=[Relation:QualifiedName] '->' subject=TermRef ',' object=RelationTerms
;

Specification:
    'specify' name=ID
    ( '{' (metadata+=Metadata | uses+=Use | instances+=Instance | applies+=Apply)* '}' )?
;

Use:
    'use' language=[Language:QualifiedName]
;

Require:
    'require' principle=[Principle:QualifiedName]
;

Instance:
    name=ID '<-' token=[Token:QualifiedName]
    ( '{' (metadata+=Metadata | bindings+=Binding | applies+=Apply)* '}' )?
;

Binding:
    term=[Term:ID] '->' value=Value
;

Metadata:
    ':' key=ID value=STRING
;

PrincipleReference:
    'satisfies' principle=[Principle:QualifiedName]
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
