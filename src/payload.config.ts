import './lib/mongo-dns'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Aircraft } from './collections/Aircraft'
import { AuditEvents } from './collections/AuditEvents'
import { Batteries } from './collections/Batteries'
import { BatteryCharges } from './collections/BatteryCharges'
import { Checklists } from './collections/Checklists'
import { ComplianceViolations } from './collections/ComplianceViolations'
import { Components } from './collections/Components'
import { Documents } from './collections/Documents'
import { Equipment } from './collections/Equipment'
import { Flights } from './collections/Flights'
import { FlightTracks } from './collections/FlightTracks'
import { Incidents } from './collections/Incidents'
import { Inspections } from './collections/Inspections'
import { MaintenanceRecords } from './collections/MaintenanceRecords'
import { Media } from './collections/Media'
import { Missions } from './collections/Missions'
import { Notifications } from './collections/Notifications'
import { Operators } from './collections/Operators'
import { Organizations } from './collections/Organizations'
import { Projects } from './collections/Projects'
import { RiskAssessments } from './collections/RiskAssessments'
import { Users } from './collections/Users'
import { seedIfEmpty } from './seed'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const s3Bucket = process.env.AWS_S3_BUCKET

const plugins = s3Bucket
  ? [
      s3Storage({
        collections: {
          media: true,
        },
        bucket: s3Bucket,
        config: {
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
          },
          region: process.env.AWS_S3_REGION || '',
        },
      }),
    ]
  : []

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Organizations,
    Users,
    Media,
    Projects,
    Missions,
    Aircraft,
    Components,
    Equipment,
    Batteries,
    BatteryCharges,
    Operators,
    Flights,
    FlightTracks,
    Incidents,
    MaintenanceRecords,
    Inspections,
    Checklists,
    RiskAssessments,
    Notifications,
    Documents,
    ComplianceViolations,
    AuditEvents,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  sharp,
  plugins,
  bin: [
    {
      key: 'seed',
      scriptPath: path.resolve(dirname, 'seed.ts'),
    },
  ],
  onInit: async (payload) => {
    try {
      await seedIfEmpty(payload)
    } catch (err) {
      payload.logger.error({ err }, 'Seed onInit failed — check DATABASE_URL')
    }
  },
})
