import type { CollectionConfig } from 'payload'

export const Inspections: CollectionConfig = {
  slug: 'inspections',
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
      name: 'assetType',
      type: 'select',
      required: true,
      options: [
        { label: 'Aircraft', value: 'aircraft' },
        { label: 'Battery', value: 'battery' },
        { label: 'Component', value: 'component' },
        { label: 'Equipment', value: 'equipment' },
      ],
    },
    {
      name: 'assetId',
      type: 'text',
      required: true,
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'scheduled',
      options: [
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Due', value: 'due' },
        { label: 'Overdue', value: 'overdue' },
        { label: 'Passed', value: 'passed' },
        { label: 'Failed', value: 'failed' },
      ],
    },
    {
      name: 'dueDate',
      type: 'date',
    },
    {
      name: 'completedAt',
      type: 'date',
    },
  ],
}
