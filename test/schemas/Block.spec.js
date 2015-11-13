import assert from 'assert';
import BlockDefinition from '../../src/schemas/Block';

var uuid = require('uuid');

describe('BlockDefinition', () => {

  it('should validate (case 1)', () => {

    assert(BlockDefinition.validate({
      id: uuid.v4(),
      metadata: {
        authors: [],
        version: "0.0.0",
        tags: {}
      },
      components: [ uuid.v4(), uuid.v4() ]      
    }));
  });

  it('should validate (case 2)', () => {

    assert(BlockDefinition.validate({
      id: uuid.v4(),
      metadata: {
        authors: [],
        version: "0.0.0",
        tags: {}
      },
      options: [ uuid.v4(), uuid.v4() ]      
    }));
  });
});
