import type { CollectionConfig } from 'payload'

export const Missions: CollectionConfig = {
  slug: 'missions',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'organization',
      type: 'relationship',
      relationTo: 'organizations',
      required: true,
    },
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'projects',
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'code',
      type: 'text',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Submitted', value: 'submitted' },
        { label: 'Under Review', value: 'under_review' },
        { label: 'Approved', value: 'approved' },
        { label: 'Assigned', value: 'assigned' },
        { label: 'In Progress', value: 'in_progress' },
        { label: 'Completed', value: 'completed' },
        { label: 'Closed', value: 'closed' },
      ],
    },
    {
      name: 'riskLevel',
      type: 'select',
      options: [
        { label: 'Low', value: 'low' },
        { label: 'Medium', value: 'medium' },
        { label: 'High', value: 'high' },
        { label: 'Critical', value: 'critical' },
      ],
    },
    {
      name: 'boundaries',
      type: 'json',
    },
    {
      name: 'scheduledStart',
      type: 'date',
    },
    {
      name: 'scheduledEnd',
      type: 'date',
    },
  ],
}
