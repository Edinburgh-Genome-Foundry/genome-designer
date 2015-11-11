import fields from './fields';
// import * as validators from './fields/validators';
import SchemaDefinition from './SchemaDefinition';

import MetadataDefinition from './Metadata';

const InstanceDefinition = new SchemaDefinition({
  id: [
    fields.id().required,
    'ID of the instance',
  ],
  parent: [
    fields.id(),
    'Ancestral parent from which object is derived',
  ],
  metadata: [
    MetadataDefinition,
    'Metadata for the object',
  ],
});

export default InstanceDefinition;
