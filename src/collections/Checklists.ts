import type { CollectionConfig } from 'payload'

export const Checklists: CollectionConfig = {
  slug: 'checklists',
  admin: { useAsTitle: 'name' },
  fields: [
    { name: 'organization', type: 'relationship', relationTo: 'organizations', required: true },
    { name: 'name', type: 'text', required: true },
    {
      name: 'checklistType',
      type: 'select',
      required: true,
      defaultValue: 'preflight',
      options: [
        { label: 'Pre-flight', value: 'preflight' },
        { label: 'Post-flight', value: 'postflight' },
        { label: 'Mission preparation', value: 'mission_prep' },
        { label: 'Aircraft inspection', value: 'aircraft_inspection' },
        { label: 'Equipment inspection', value: 'equipment_inspection' },
        { label: 'Battery inspection', value: 'battery_inspection' },
        { label: 'Emergency', value: 'emergency' },
        { label: 'Site operations', value: 'site_ops' },
        { label: 'Custom', value: 'custom' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        {
          name: 'itemType',
          type: 'select',
          required: true,
          defaultValue: 'pass_fail',
          options: [
            { label: 'Pass / Fail', value: 'pass_fail' },
            { label: 'Yes / No', value: 'yes_no' },
            { label: 'Number', value: 'number' },
            { label: 'Text', value: 'text' },
            { label: 'Photo', value: 'photo' },
            { label: 'Signature', value: 'signature' },
            { label: 'Notes', value: 'notes' },
          ],
        },
        { name: 'required', type: 'checkbox', defaultValue: true },
      ],
    },
  ],
}
