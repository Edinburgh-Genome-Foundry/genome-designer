var uuid = require("uuid");

export default class Instance {
  constructor(forceId = uuid.v4()) {
    Object.assign(this, {
      id: forceId,
      metadata: {
        name: '',
        description: '',
        version: '1.0.0',
        authors: [],
        tags: {},
      },
    });
  }

  //this is just a placeholder until we are using immutables...
  //note, wont be of same class but has same prototype etc.
  clone() {
    return Object.assign(Object.create(this), this);
  }

  rename(newName) {
    const newInstance = this.clone();
    newInstance.metadata.name = newName;
    return newInstance;
  }
}
