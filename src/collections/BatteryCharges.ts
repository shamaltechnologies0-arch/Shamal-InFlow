import type { CollectionConfig } from 'payload'

export const BatteryCharges: CollectionConfig = {
  slug: 'battery-charges',
  admin: { useAsTitle: 'id' },
  fields: [
    { name: 'organization', type: 'relationship', relationTo: 'organizations', required: true },
    { name: 'battery', type: 'relationship', relationTo: 'batteries', required: true },
    { name: 'flight', type: 'relationship', relationTo: 'flights' },
    { name: 'chargedAt', type: 'date', required: true },
    { name: 'cycleNumber', type: 'number' },
    { name: 'chargeLevel', type: 'number' },
    { name: 'dischargeLevel', type: 'number' },
    { name: 'healthScore', type: 'number' },
    { name: 'notes', type: 'textarea' },
  ],
}
