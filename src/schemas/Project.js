import fields from './fields';
import * as validators from './fields/validators';
import InstanceDefinition from './Instance';

/**
 @name ProjectDefinition
 @description
 Project is the container for a body of work. It consists primarily of constructs

*/

const ProjectDefinition = InstanceDefinition.extend({
  constructs: [
    fields.arrayOf(validators.id()).required,
    'Constructs associated with this project'
  ],
  settings: [
    fields.object(),
    'Settings associated with this project'
  ]
});

export default ProjectDefinition;