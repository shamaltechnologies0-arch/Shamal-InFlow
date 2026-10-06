import type { CollectionConfig } from 'payload'

export const ComplianceViolations: CollectionConfig = {
  slug: 'compliance-violations',
  admin: {
    useAsTitle: 'ruleCode',
  },
  fields: [
    {
      name: 'organization',
      type: 'relationship',
      relationTo: 'organizations',
      required: true,
    },
    {
      name: 'severity',
      type: 'select',
      required: true,
      options: [
        { label: 'Normal', value: 'normal' },
        { label: 'Warning', value: 'warning' },
        { label: 'Critical', value: 'critical' },
      ],
    },
    {
      name: 'ruleCode',
      type: 'text',
      required: true,
    },
    {
      name: 'message',
      type: 'textarea',
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
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'open',
      options: [
        { label: 'Open', value: 'open' },
        { label: 'Acknowledged', value: 'acknowledged' },
        { label: 'Resolved', value: 'resolved' },
      ],
    },
  ],
}
