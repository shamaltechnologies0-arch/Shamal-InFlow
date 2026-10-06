import type { CollectionConfig } from 'payload'

export const Operators: CollectionConfig = {
  slug: 'operators',
  admin: {
    useAsTitle: 'fullName',
  },
  fields: [
    {
      name: 'organization',
      type: 'relationship',
      relationTo: 'organizations',
      required: true,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'fullName',
      type: 'text',
      required: true,
    },
    {
      name: 'employeeId',
      type: 'text',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Suspended', value: 'suspended' },
      ],
    },
    {
      name: 'totalFlightHours',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'currencyStatus',
      type: 'select',
      required: true,
      defaultValue: 'current',
      options: [
        { label: 'Current', value: 'current' },
        { label: 'Expiring', value: 'expiring' },
        { label: 'Expired', value: 'expired' },
      ],
    },
    {
      name: 'role',
      type: 'text',
      defaultValue: 'Pilot',
    },
    {
      name: 'contactEmail',
      type: 'email',
    },
    {
      name: 'contactPhone',
      type: 'text',
    },
    {
      name: 'flightCount',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'skills',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'BVLOS', value: 'bvlos' },
        { label: 'Night', value: 'night' },
        { label: 'Thermal', value: 'thermal' },
        { label: 'RTK', value: 'rtk' },
        { label: 'Dock Ops', value: 'dock' },
        { label: 'Survey', value: 'survey' },
        { label: 'LiDAR', value: 'lidar' },
        { label: 'Mapping', value: 'mapping' },
        { label: 'Inspection', value: 'inspection' },
      ],
    },
    {
      name: 'licenseExpiry',
      type: 'date',
    },
  ],
}
