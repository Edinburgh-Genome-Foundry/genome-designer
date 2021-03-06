import AnnotationDefinition from '../../src/schemas/Annotation';
import chai from 'chai';

const { assert } = chai;

describe('AnnotationDefinition', () => {
  it('should be loggable', () => {
    //console.log(AnnotationDefinition);

    assert(true);
  });

  it('should describe', () => {
    const description = AnnotationDefinition.describe();
    //console.log(description);

    assert(typeof description === 'object');
  });


  it('should validate', () => {
    assert(AnnotationDefinition.validate({
      description: 'example annotation',
      tags: {},
      optimizability: 'none',
      sequence: 'acgtagc',
    }));
  });
});
