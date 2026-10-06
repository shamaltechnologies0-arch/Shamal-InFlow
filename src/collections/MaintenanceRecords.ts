import type { CollectionConfig } from 'payload'

export const MaintenanceRecords: CollectionConfig = {
  slug: 'maintenance-records',
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
        { label: 'Overdue', value: 'overdue' },
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'In Progress', value: 'in_progress' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
    {
      name: 'dueLabel',
      type: 'text',
    },
    {
      name: 'assetLabel',
      type: 'text',
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
