import fields from './fields';
import * as validators from './fields/validators';
import SchemaDefinition from './SchemaDefinition';

/**
 @name UserDefinition
 @description A user account
*/

const UserDefinition = new SchemaDefinition({
  id: [
    fields.id().required,
    `ID of the User`,
  ],
  email: [
    fields.email().required,
    `User's Email Address`,
  ],
  firstName: [
    fields.string(),
    `First name of user`,
  ],
  lastName: [
    fields.string(),
    `Last name of user`,
  ],
  description: [
    fields.string(),
    `Short biography of the user`,
  ],
  homepage: [
    fields.url(),
    `URL of personal page`,
  ],
  social: [
    fields.arrayOf(validators.shape({
      provider: validators.string(),
      username: validators.string(),
    })),
    `List of social media accounts`,
  ],
});

export default UserDefinition;
