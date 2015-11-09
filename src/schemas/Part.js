import fields from './fields';
import * as validators from './fields/validators';
import InstanceDefinition from './Instance';
import AnnotationDefinition from './Annotation';

/**
 @name PartDefinition
 @description
 Represents a physical sequence, sourced from an Inventory
 */

const PartDefinition = InstanceDefinition.extend({
  sequence  : [
    fields.id(),
    'ID of the associated Sequence (not the sequence itself)'
  ],
  source    : [
    fields.id(),
    'Source (Inventory) ID of the Part'
  ],
  annotations: [
    fields.arrayOf(AnnotationDefinition.validate),
    'A list of Annotations associated with the Part'
  ]
});

export default PartDefinition;