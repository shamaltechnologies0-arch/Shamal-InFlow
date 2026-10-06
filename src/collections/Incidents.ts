import type { CollectionConfig } from 'payload'

export const Incidents: CollectionConfig = {
  slug: 'incidents',
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
      name: 'cause',
      type: 'text',
    },
    {
      name: 'severity',
      type: 'select',
      required: true,
      options: [
        { label: 'Low', value: 'low' },
        { label: 'Medium', value: 'medium' },
        { label: 'High', value: 'high' },
        { label: 'Critical', value: 'critical' },
        { label: 'Major', value: 'major' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'open',
      options: [
        { label: 'Open', value: 'open' },
        { label: 'Under Review', value: 'under_review' },
        { label: 'Investigating', value: 'investigating' },
        { label: 'Resolved', value: 'resolved' },
        { label: 'Closed', value: 'closed' },
      ],
    },
    {
      name: 'shared',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'personnelLabel',
      type: 'text',
    },
    {
      name: 'locationLabel',
      type: 'text',
    },
    {
      name: 'flight',
      type: 'relationship',
      relationTo: 'flights',
    },
    {
      name: 'aircraft',
      type: 'relationship',
      relationTo: 'aircraft',
    },
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'projects',
    },
    {
      name: 'reportedAt',
      type: 'date',
    },
  ],
}
