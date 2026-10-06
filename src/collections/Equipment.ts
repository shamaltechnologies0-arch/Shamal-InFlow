import type { CollectionConfig } from 'payload'

export const Equipment: CollectionConfig = {
  slug: 'equipment',
  admin: { useAsTitle: 'name' },
  fields: [
    { name: 'organization', type: 'relationship', relationTo: 'organizations', required: true },
    { name: 'name', type: 'text', required: true },
    {
      name: 'equipmentType',
      type: 'select',
      required: true,
      defaultValue: 'other',
      options: [
        { label: 'Camera', value: 'camera' },
        { label: 'Gimbal', value: 'gimbal' },
        { label: 'LiDAR', value: 'lidar' },
        { label: 'RTK', value: 'rtk' },
        { label: 'Charger', value: 'charger' },
        { label: 'Case', value: 'case' },
        { label: 'Controller', value: 'controller' },
        { label: 'Tablet', value: 'tablet' },
        { label: 'Ground Station', value: 'ground_station' },
        { label: 'Survey', value: 'survey' },
        { label: 'GNSS', value: 'gnss' },
        { label: 'Other', value: 'other' },
      ],
    },
    { name: 'serialNumber', type: 'text' },
    { name: 'manufacturer', type: 'text' },
    { name: 'model', type: 'text' },
    { name: 'assignedUser', type: 'text' },
    { name: 'aircraft', type: 'relationship', relationTo: 'aircraft' },
    { name: 'flightHours', type: 'number', defaultValue: 0 },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'operational',
      options: [
        { label: 'Operational', value: 'operational' },
        { label: 'Maintenance', value: 'maintenance' },
        { label: 'Retired', value: 'retired' },
        { label: 'Lost', value: 'lost' },
      ],
    },
  ],
}
