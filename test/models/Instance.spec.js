import Instance from '../../src/models/Instance';
import chai from 'chai';

const { assert, expect } = chai;

describe('Instance Model', () => {
  describe('Constructor', () => {
    it('should exist, be callable with new', () => {
      const inst = new Instance();

      expect(inst.constructor).to.be.a('function');
    });

    it('should accept existing input', () => {
      const existing = {
        metadata: {
          name: 'blah',
        },
      };
      const inst = new Instance(existing);

      expect(inst.metadata.name).to.equal('blah');
    });

    it('should accept further properties to use in the base', () => {
      class Extended extends Instance {
        constructor(...args) {
          super(...args, {
            customProp: [],
          });
        }
        addToArray(...stuff) {
          return this.mutate('customProp', this.customProp.concat(stuff));
        }
      }
      const ext = new Extended();

      expect(ext.customProp).to.be.an('array');
      expect(ext.addToArray).to.be.a('function');

      const added = ext.addToArray('some', 'stuff');
      expect(ext.customProp).to.have.length(0);
      expect(added.customProp).to.eql(['some', 'stuff']);
    });
  });

  it('should return a new object when mutated', () => {
    const inst = new Instance();
    const newInst = inst.mutate('meaning.oflife', 42);

    assert(inst !== newInst);
    expect(inst.meaning).to.be.undefined;
    expect(newInst.meaning.oflife).to.equal(42);
  });
});
