'use server'

import { Partner } from '@/payload-types'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function getPartnersData(): Promise<Partner | null> {
  try {
    const payload = await getPayload({ config })
    const partnersData = await payload.findGlobal({
      slug: 'partners',
      depth: 1, // Adjust depth as needed
    })
    return partnersData as Partner | null
  } catch (error) {
    console.error('Error fetching partners global:', error)
    return null // Return null or throw error as needed
  }
}
