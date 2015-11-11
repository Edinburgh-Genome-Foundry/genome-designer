import fields from './fields';
import InstanceDefinition from './Instance';

/**
 @name InventoryDefinition
 @description
 An Inventory is a foundry / freezer / storage facility, the location where e.g. a part is sourced
*/

//todo - what else do we need?

const InventoryDefinition = InstanceDefinition.extend({
  url: [
    fields.url(),
    `URL that is API endpoint for the Inventory`,
  ],
});

export default InventoryDefinition;
