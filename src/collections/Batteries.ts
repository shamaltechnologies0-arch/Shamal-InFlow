import type { CollectionConfig } from 'payload'

export const Batteries: CollectionConfig = {
  slug: 'batteries',
  admin: {
    useAsTitle: 'serialNumber',
  },
  fields: [
    {
      name: 'organization',
      type: 'relationship',
      relationTo: 'organizations',
      required: true,
    },
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'serialNumber',
      type: 'text',
      required: true,
    },
    {
      name: 'model',
      type: 'text',
    },
    {
      name: 'legalId',
      type: 'text',
    },
    {
      name: 'shared',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'ownerLabel',
      type: 'text',
    },
    {
      name: 'aircraft',
      type: 'relationship',
      relationTo: 'aircraft',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'operational',
      options: [
        { label: 'Operational', value: 'operational' },
        { label: 'Maintenance', value: 'maintenance' },
        { label: 'Retired', value: 'retired' },
        { label: 'Damaged', value: 'damaged' },
      ],
    },
    {
      name: 'healthScore',
      type: 'number',
    },
    {
      name: 'cycleCount',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'cycleLifespan',
      type: 'number',
      defaultValue: 200,
    },
    {
      name: 'flightCount',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'flightLifespan',
      type: 'number',
      defaultValue: 500,
    },
    {
      name: 'flightHours',
      type: 'number',
      defaultValue: 0,
    },
  ],
}
