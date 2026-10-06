import type { CollectionConfig } from 'payload'

export const FlightTracks: CollectionConfig = {
  slug: 'flight-tracks',
  admin: {
    defaultColumns: ['flight', 'pointCount', 'simplified'],
  },
  fields: [
    {
      name: 'organization',
      type: 'relationship',
      relationTo: 'organizations',
      required: true,
    },
    {
      name: 'flight',
      type: 'relationship',
      relationTo: 'flights',
      required: true,
    },
    {
      name: 'geometry',
      type: 'json',
    },
    {
      name: 'pointCount',
      type: 'number',
    },
    {
      name: 'simplified',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}
