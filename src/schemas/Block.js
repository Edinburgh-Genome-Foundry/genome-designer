import fields from './fields';
import * as validators from './fields/validators';
import InstanceDefinition from './Instance';
import AnnotationDefinition from './Annotation';

/**
 @name BlockDefinition
 @description A component of a construct, or construct itself
 @sbol Component

 */

//SBOL has a field called role, particularly in defining modules. We may want to add this later. For now, this annotation can be a role per-component.
export const enumRoles = [

  //SBOL
  'Promoter',
  'RBS',
  'CDS',
  'Terminator',
  'Gene',
  'Engineered Gene',
  'mRNA',

  //others
  'placeholder',
];

//todo - better define structure
const ruleShape = validators.shape({
  type: validators.string(),
  params: validators.object(),
});

const annotationShape = validators.shape({
  //todo - define structure
});

const BlockDefinition = InstanceDefinition.extend({
  /*
   Part-like fields for sequence and sequence annotations, inventory source
   */
  sequence: [
    fields.shape({
      id: validators.id(),
      annotations: validators.array(annotationShape),
    }),
    `ID of the associated Sequence (not the sequence itself), and list of Annotations associated`,
  ],
  source: [
    fields.shape({
      id: validators.id(),
      existsAsPart: validators.bool(),
    }),
    `Source (Inventory) ID of the Part`,
  ],

  rules: [
    fields.arrayOf(ruleShape),
    `Grammar/rules governing the whole Block`,
  ],

  components: [
    fields.arrayOf(validators.shape({
      rules: ruleShape,
      options: validators.arrayOf(validators.id()),
    })).required,
    `Array of Blocks (and their rules) of which this Block is comprised`,
  ],

  notes: [
    fields.arrayOf(validators.string()),
    `Notes about the whole Block`,
  ]
});

export default BlockDefinition;
