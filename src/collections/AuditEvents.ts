import type { CollectionConfig } from 'payload'

export const AuditEvents: CollectionConfig = {
  slug: 'audit-events',
  admin: {
    useAsTitle: 'action',
  },
  fields: [
    {
      name: 'organization',
      type: 'relationship',
      relationTo: 'organizations',
      required: true,
    },
    {
      name: 'actorEmail',
      type: 'text',
    },
    {
      name: 'action',
      type: 'text',
      required: true,
    },
    {
      name: 'entityType',
      type: 'text',
    },
    {
      name: 'entityId',
      type: 'text',
    },
    {
      name: 'previous',
      type: 'json',
    },
    {
      name: 'next',
      type: 'json',
    },
    {
      name: 'requestId',
      type: 'text',
    },
    {
      name: 'ip',
      type: 'text',
    },
  ],
}
