import assert from 'assert';
import AnnotationDefinition from '../../src/schemas/Annotation';

describe('AnnotationDefinition', () => {

  /*it('should be loggable', () => {
    console.log(AnnotationDefinition);
    assert(true);
  });*/

  it('should describe', () => {
    let description = AnnotationDefinition.describe();
    assert(!!description);
  });


  it('should validate', () => {

    //todo - should we be generating this?
    let id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

    assert(AnnotationDefinition.validate({
      description: 'example annotation',
      tags: {},
      optimizability: 'none',
      sequence : 'acgtagc'
    }));
  });
});
