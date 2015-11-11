import fields from './fields';

// import * as validators from './fields/validators';
import SchemaDefinition from './SchemaDefinition';

/**
 @name UserSettingsDefinition
 @description
 Dictionary of persistent user settings
 */

// todo - what else do we need? What cannot be captured in the URL?

const UserSettingsDefinition = new SchemaDefinition({
  id: [
    fields.id().required
      `ID of UserSettings`,
  ],

  // Let UserDefinition Specify?
  user: [
    fields.id().required,
    `Associated User`,
  ],
  state: [
    fields.object(),
    `Actual information about User Settings`,
  ],
});

export default UserSettingsDefinition;
