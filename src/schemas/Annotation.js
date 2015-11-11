import fields from './fields';
// import * as validators from './fields/validators';
import SchemaDefinition from './SchemaDefinition';

/**
 @name AnnotationDefinition
 @parent PartDefinition
 @sbol Annotation (kinda)

 @description
 An annotation on a sequence.
 Should either have a sequence or start+end location

 Later, we may want to make a field that notes how optimizable the sequence is. E.g. none, codon-optimize, or random sequence. It may be represented as a degenerate sequence?
 */

const AnnotationDefinition = new SchemaDefinition({

  description: [
    fields.string(),
    'Description of annotation',
  ],
  tags: [
    fields.object().required,
    'Dictionary of tags defining annotation',
  ],
  sequence: [
    fields.sequence(),
    'IUPAC sequence of the annotation',
  ],
  start: [
    fields.number({min: 0}),
    'Location of start of annoation',
  ],
  end: [
    fields.number({min: 0}),
    'Location of end of annotation',
  ],
});

export default AnnotationDefinition;
