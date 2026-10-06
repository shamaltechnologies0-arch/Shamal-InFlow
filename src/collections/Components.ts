import type { CollectionConfig } from 'payload'

export const Components: CollectionConfig = {
  slug: 'components',
  admin: { useAsTitle: 'name' },
  fields: [
    { name: 'organization', type: 'relationship', relationTo: 'organizations', required: true },
    { name: 'name', type: 'text', required: true },
    {
      name: 'componentType',
      type: 'select',
      required: true,
      defaultValue: 'other',
      options: [
        { label: 'Motor', value: 'motor' },
        { label: 'Propeller CW', value: 'propeller_cw' },
        { label: 'Propeller CCW', value: 'propeller_ccw' },
        { label: 'ESC', value: 'esc' },
        { label: 'Landing Gear', value: 'landing_gear' },
        { label: 'Arm', value: 'arm' },
        { label: 'Flight Controller', value: 'flight_controller' },
        { label: 'GNSS', value: 'gnss' },
        { label: 'Other', value: 'other' },
      ],
    },
    { name: 'manufacturer', type: 'text' },
    { name: 'model', type: 'text' },
    { name: 'serialNumber', type: 'text' },
    { name: 'aircraft', type: 'relationship', relationTo: 'aircraft' },
    { name: 'installationDate', type: 'date' },
    { name: 'operatingHours', type: 'number', defaultValue: 0 },
    { name: 'flightCount', type: 'number', defaultValue: 0 },
    { name: 'replacementDate', type: 'date' },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'operational',
      options: [
        { label: 'Operational', value: 'operational' },
        { label: 'Maintenance', value: 'maintenance' },
        { label: 'Retired', value: 'retired' },
        { label: 'Removed', value: 'removed' },
      ],
    },
  ],
}
