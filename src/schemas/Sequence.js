import fields from './fields';
import InstanceDefinition from './Instance';

/**
 @name SequenceDefinition
 @sbol Sequence (mostly)
 @description
 A sequence, typically of a part and a large string. Sequences are references because they are not usually loaded in the applicaiton, and may be very large, so can be loaded with their own API for defining desired regions.
*/

export const enumType = [
  'dna',        //IUPAC DNA
  'protein',    //IUPAC Protein
  'molecule',   //SMILES
];

const SequenceDefinition = InstanceDefinition.extend({
  type: [
    fields.oneOf(enumType).required,
    `Type of sequence, as defined in ${enumType.join(', ')}, to determine valid monomers}`,
  ],

  //todo - define. placeholders? rules? need schema-level validation based on type
  sequence: [
    fields.sequence().required,
    `String representing monomers of the sequence`,
  ],
  length: [
    fields.number(),
    `Length of the sequence (calculated on the server)`,
  ],

  //default is forward (true)
  orientForward: [
    fields.bool(),
    ``,
  ],
});

export default SequenceDefinition;
