import fields from './fields';
import InstanceDefinition from './Instance';
import AnnotationDefinition from './Annotation';

/**
 @name PartDefinition
 @description
 Represents a physical sequence, sourced from an Inventory
 */

const PartDefinition = InstanceDefinition.extend({
  sequence  : [
    fields.id().required,
    `ID of the associated Sequence (not the sequence itself)`
  ],
  source    : [
    fields.id().required,
    `Source (Inventory) ID of the Part`
  ],
  annotations: [
    fields.arrayOf(fields.id()).required,
    `A list of Annotations associated with the Part`
  ]
});

export default PartDefinition;