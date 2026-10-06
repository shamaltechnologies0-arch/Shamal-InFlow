import type { CollectionConfig } from 'payload'

export const Notifications: CollectionConfig = {
  slug: 'notifications',
  admin: { useAsTitle: 'title' },
  fields: [
    { name: 'organization', type: 'relationship', relationTo: 'organizations', required: true },
    { name: 'title', type: 'text', required: true },
    { name: 'body', type: 'textarea' },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'info',
      options: [
        { label: 'Inspection due', value: 'inspection_due' },
        { label: 'Inspection overdue', value: 'inspection_overdue' },
        { label: 'Maintenance due', value: 'maintenance_due' },
        { label: 'Maintenance overdue', value: 'maintenance_overdue' },
        { label: 'Battery cycle', value: 'battery_cycle' },
        { label: 'Document expiry', value: 'document_expiry' },
        { label: 'Pilot cert expiry', value: 'pilot_cert_expiry' },
        { label: 'Checklist missing', value: 'checklist_missing' },
        { label: 'Compliance violation', value: 'compliance_violation' },
        { label: 'Incident', value: 'incident' },
        { label: 'Mission approval', value: 'mission_approval' },
        { label: 'Info', value: 'info' },
      ],
    },
    {
      name: 'severity',
      type: 'select',
      required: true,
      defaultValue: 'info',
      options: [
        { label: 'Info', value: 'info' },
        { label: 'Warning', value: 'warning' },
        { label: 'Critical', value: 'critical' },
      ],
    },
    { name: 'read', type: 'checkbox', defaultValue: false },
    { name: 'relatedEntityType', type: 'text' },
    { name: 'relatedEntityId', type: 'text' },
  ],
}
