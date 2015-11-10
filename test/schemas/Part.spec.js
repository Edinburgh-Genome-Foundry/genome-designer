import assert from 'assert';
import PartDefinition from '../../src/schemas/Part';

var uuid = require('uuid');

describe('AnnotationDefinition', () => {

  it('should validate (case 1)', () => {

    //todo - should we be generating this?
    let id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

    assert(PartDefinition.validate({
      id: uuid.v4(),
      metadata: {
        authors: [],
        version: "0.0.0"
      },
      subcomponents: []
    }));
  });
});
