import assert from 'assert';
import BlockDefinition from '../../src/schemas/Block';

var uuid = require('uuid');

describe('BlockDefinition', () => {

  it('should validate (case 1)', () => {

    //todo - should we be generating this?
    let id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

    assert(BlockDefinition.validate({
      id: uuid.v4(),
      metadata: {
        authors: [],
        version: "0.0.0"
      },
      subcomponents: [uuid.v4()]
    }));
  });
});
