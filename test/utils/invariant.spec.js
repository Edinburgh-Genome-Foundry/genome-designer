import invariant from '../../src/utils/environment/invariant';
import chai from 'chai';

describe('invariant', () => {
  it('should throw when there are errors', () => {
    chai.expect(() => {
      invariant(true, 'nope');
    }).to.not.throw();

    chai.expect(() => {
      invariant(false, 'yup');
    }).to.throw();
  });

  it('should throw the error message', () => {
    chai.expect(() => {
      invariant(false, 'yup');
    }).to.throw('yup');

    chai.expect(() => {
      const ohnoes = 'oh no';
      invariant(false, `golly! ${ohnoes}`);
    }).to.throw('golly! oh no');
  });
});
