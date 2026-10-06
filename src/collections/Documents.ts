import type { CollectionConfig } from 'payload'

export const Documents: CollectionConfig = {
  slug: 'documents',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'organization',
      type: 'relationship',
      relationTo: 'organizations',
      required: true,
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'documentType',
      type: 'text',
    },
    {
      name: 'category',
      type: 'select',
      defaultValue: 'other',
      options: [
        { label: 'Flight', value: 'flight' },
        { label: 'Pilot', value: 'pilot' },
        { label: 'Organization', value: 'organization' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'reference',
      type: 'text',
    },
    {
      name: 'holderName',
      type: 'text',
    },
    {
      name: 'shared',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'expiryDate',
      type: 'date',
    },
    {
      name: 'storageKey',
      type: 'text',
    },
    {
      name: 'linkedEntityType',
      type: 'text',
    },
    {
      name: 'linkedEntityId',
      type: 'text',
    },
  ],
}
