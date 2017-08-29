# Digiõppevara

## Coding standards

All code should follow the [coding standards](https://www.drupal.org/docs/develop/standards) established by Drupal Core team.

## Submodules

### ov_access

#### Configuration
1. Create the role for Expert.
1. Make sure that the **h5p_content** and **user** have taxonomy based fields, these should be based on the same hierarchy.
  * Make sure that the field on **h5p_content** is configured to be single-valued.
  * The one for **user** will only be available to people with administrating rights, once properly configured.
1. Go to the settings page, select suitable role and fields and save that configuration.

#### Applied logic
System will then try to check if any of the terms within the user profile would match with the one (or any of its parents) selected within the entity. In case of successful match, user will be granted an **update** permission to certain entities.
