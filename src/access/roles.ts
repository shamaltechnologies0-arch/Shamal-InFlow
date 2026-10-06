import type { Access, CollectionConfig } from 'payload'

const authenticated: Access = ({ req: { user } }) => Boolean(user)

const adminOnly: Access = ({ req: { user } }) => {
  if (!user) return false
  return (user as { role?: string }).role === 'admin'
}

/** Soft RBAC scaffold — tighten per-collection rules as modules mature. */
export const accessByRole = {
  authenticated,
  adminOnly,
  readAuthenticated: authenticated,
  mutateOpsOrAdmin: (({ req: { user } }) => {
    if (!user) return false
    const role = (user as { role?: string }).role
    return role === 'admin' || role === 'ops_manager' || role === 'maintenance' || role === 'compliance'
  }) as Access,
}
