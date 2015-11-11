import * as validatorFunctions from './validators';
import createFieldType from './createFieldType';
import mapValues from '../../utils/object/mapValues';

/**
 * @name fields
 * @description
 * Exports a dictionary of field types to unparameterized fieldType functions. These are called with parameters passed to the baseValidator, and return a fully defined fieldType object.
 *
 * See createFieldType for what is output.
 *
 * @example
 * import fields from './fields';
 * import * as validatorFunctions from './validators';
 *
 * let myField = fields.id().required;
 *
 returns:
 {
  type: 'id'
  validate: {Parameterized validation function}
  isRequired: true
  typeDescription: <from fields.js>
  baseValidator:  validatorFunctions.id
}
 */
const fields = mapValues({

  //primitives

  id: {
    baseValidator: validatorFunctions.id,
    typeDescription: 'A UUID',
  },
  string: {
    baseValidator: validatorFunctions.string,
    typeDescription: 'A string',
  },
  number: {
    baseValidator: validatorFunctions.number,
    typeDescription: 'A number',
  },
  func: {
    baseValidator: validatorFunctions.func,
    typeDescription: 'A function',
  },
  array: {
    baseValidator: validatorFunctions.array,
    typeDescription: 'An array, with any values',
  },
  object: {
    baseValidator: validatorFunctions.object,
    typeDescription: 'An object, of any shape',
  },
  bool: {
    baseValidator: validatorFunctions.bool,
    typeDescription: 'A boolean, strictly true or false',
  },
  undef: {
    baseValidator: validatorFunctions.undef,
    typeDescription: 'the value undefined',
  },

  //string subtypes

  sequence: {
    baseValidator: validatorFunctions.sequence,
    typeDescription: 'An IUPAC compliant sequence',
  },
  email: {
    baseValidator: validatorFunctions.email,
    typeDescription: 'A valid email address',
  },
  version: {
    baseValidator: validatorFunctions.version,
    typeDescription: 'String conforming to semantic versioning',
  },
  url: {
    baseValidator: validatorFunctions.url,
    typeDescription: 'A valid URL',
  },

  //complex - functions + classes

  shape: {
    baseValidator: validatorFunctions.shape,
    typeDescription: 'An object with a defined fields and types',
  },
  equal: {
    baseValidator: validatorFunctions.equal,
    typeDescription: 'Equality check using Object.is()',
  },
  instanceOf: {
    baseValidator: validatorFunctions.instanceOf,
    typeDescription: 'Instance of another class',
  },
  oneOf: {
    baseValidator: validatorFunctions.oneOf,
    typeDescription: 'Input matches item in possible values',
  },
  oneOfType: {
    baseValidator: validatorFunctions.oneOfType,
    typeDescription: 'Value matches at least one possibility, which may be (1) an object (instanceof), or (2) validation function',
  },
  arrayOf: {
    baseValidator: validatorFunctions.arrayOf,
    typeDescription: 'An array, where each item passes the passed validation function',
  },
}, createFieldType);

//todo - assert that every type has a corresponding baseValidator and is function

export const fieldNames = Object.keys(fields);
export const fieldDescriptions = mapValues(fields, val => val.typeDescription);

export default fields;
