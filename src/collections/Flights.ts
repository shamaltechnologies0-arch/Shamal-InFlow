import type { CollectionConfig } from 'payload'

export const Flights: CollectionConfig = {
  slug: 'flights',
  admin: {
    useAsTitle: 'flightId',
  },
  fields: [
    {
      name: 'organization',
      type: 'relationship',
      relationTo: 'organizations',
      required: true,
    },
    {
      name: 'flightId',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'source',
      type: 'text',
    },
    {
      name: 'sourceFlightId',
      type: 'text',
    },
    {
      name: 'fingerprint',
      type: 'text',
      index: true,
    },
    {
      name: 'startTime',
      type: 'date',
    },
    {
      name: 'endTime',
      type: 'date',
    },
    {
      name: 'durationMinutes',
      type: 'number',
    },
    {
      name: 'pilot',
      type: 'relationship',
      relationTo: 'operators',
    },
    {
      name: 'aircraft',
      type: 'relationship',
      relationTo: 'aircraft',
    },
    {
      name: 'battery',
      type: 'relationship',
      relationTo: 'batteries',
    },
    {
      name: 'mission',
      type: 'relationship',
      relationTo: 'missions',
    },
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'projects',
    },
    {
      name: 'takeoff',
      type: 'group',
      fields: [
        { name: 'lat', type: 'number' },
        { name: 'lng', type: 'number' },
        { name: 'alt', type: 'number' },
      ],
    },
    {
      name: 'landing',
      type: 'group',
      fields: [
        { name: 'lat', type: 'number' },
        { name: 'lng', type: 'number' },
        { name: 'alt', type: 'number' },
      ],
    },
    {
      name: 'locationLabel',
      type: 'text',
    },
    {
      name: 'tags',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'TRACE', value: 'trace' },
        { label: 'EVENT', value: 'event' },
        { label: 'SHARED', value: 'shared' },
        { label: 'ISOLATED', value: 'isolated' },
      ],
    },
    {
      name: 'distanceKm',
      type: 'number',
    },
    {
      name: 'maxAltitudeM',
      type: 'number',
    },
    {
      name: 'maxSpeedMs',
      type: 'number',
    },
    {
      name: 'averageSpeedMs',
      type: 'number',
    },
    {
      name: 'weather',
      type: 'json',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'planned',
      options: [
        { label: 'Planned', value: 'planned' },
        { label: 'Active', value: 'active' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Imported', value: 'imported' },
      ],
    },
    {
      name: 'flightTrackId',
      type: 'text',
    },
    {
      name: 'rawStorageKey',
      type: 'text',
    },
    {
      name: 'missionType',
      type: 'text',
    },
    {
      name: 'operationType',
      type: 'text',
    },
    {
      name: 'flightPurpose',
      type: 'text',
    },
    {
      name: 'notes',
      type: 'textarea',
    },
    {
      name: 'checklistStatus',
      type: 'select',
      options: [
        { label: 'Not started', value: 'not_started' },
        { label: 'Complete', value: 'complete' },
        { label: 'Incomplete', value: 'incomplete' },
        { label: 'Violated', value: 'violated' },
      ],
    },
  ],
}
