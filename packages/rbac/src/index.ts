export * from "./registry";
export {
  type CanonicalAdminRole,
  type LegacyAdminRole,
  type AdminRole,
  type CanonicalAdminPermission,
  type LegacyAdminPermission,
  type AdminPermission,
  type RoleDefinition,
  type StaffMember,
  type PermissionOverride,
} from "./types";
export {
  ROLE_DEFINITIONS,
  hasPermission as hasLegacyPermission,
  hasAnyPermission,
  hasAllPermissions,
  getRoleDefinition,
} from "./permissions";
export * from "./masking";
export * from "./surfaces";
