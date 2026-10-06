import type { CollectionConfig } from 'payload'
import { accessByRole } from '../access/roles'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  access: {
    read: accessByRole.authenticated,
    create: accessByRole.adminOnly,
    update: accessByRole.adminOnly,
    delete: accessByRole.adminOnly,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'viewer',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Ops Manager', value: 'ops_manager' },
        { label: 'Pilot', value: 'pilot' },
        { label: 'Maintenance', value: 'maintenance' },
        { label: 'Compliance', value: 'compliance' },
        { label: 'Viewer', value: 'viewer' },
      ],
    },
    {
      name: 'organization',
      type: 'relationship',
      relationTo: 'organizations',
    },
  ],
}
