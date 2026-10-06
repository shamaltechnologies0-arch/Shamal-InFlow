import type { CollectionConfig } from 'payload'

export const RiskAssessments: CollectionConfig = {
  slug: 'risk-assessments',
  admin: { useAsTitle: 'title' },
  fields: [
    { name: 'organization', type: 'relationship', relationTo: 'organizations', required: true },
    { name: 'title', type: 'text', required: true },
    { name: 'mission', type: 'relationship', relationTo: 'missions' },
    { name: 'flight', type: 'relationship', relationTo: 'flights' },
    {
      name: 'riskLevel',
      type: 'select',
      required: true,
      defaultValue: 'medium',
      options: [
        { label: 'Low', value: 'low' },
        { label: 'Medium', value: 'medium' },
        { label: 'High', value: 'high' },
        { label: 'Critical', value: 'critical' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Submitted', value: 'submitted' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
      ],
    },
    { name: 'hazards', type: 'textarea' },
    { name: 'mitigations', type: 'textarea' },
    { name: 'responsiblePerson', type: 'text' },
    { name: 'approvedAt', type: 'date' },
  ],
}
