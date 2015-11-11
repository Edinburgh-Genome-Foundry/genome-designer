import fields from './fields';

// import * as validators from './fields/validators';
import SchemaDefinition from './SchemaDefinition';

/**
 @name UserSessionDefinition
 @description
 Information about user's last session
 */

// todo - what else do we need? What cannot be captured in the URL?

const UserSessionDefinition = new SchemaDefinition({
  id: [
    fields.id().required
      `ID of UserSession`,
  ],

  // Let UserDefinition Specify?
  user: [
    fields.id().required,
    `Associated User`,
  ],

  state: [
    fields.object(),
    `Actual information about User Session state`,
  ],
});

export default UserSessionDefinition;
