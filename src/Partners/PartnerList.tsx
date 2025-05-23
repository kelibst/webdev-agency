import React, { useEffect, useState } from 'react'
import { Media } from '@/payload-types'
import Link from 'next/link'
import Image from 'next/image'
import { InfiniteSlider } from '@/components/core/infinite-slider'
import { getPartnersData } from './getPartners'

interface partnerProps {
  logo: number | Media
  title: string
  link?: string | null | undefined
  id?: string | null | undefined
}

export const PartnerList = () => {
  // Handle cases where partnerList might be empty or not provided
  const [partners, setPartners] = useState<partnerProps[]>([])

  useEffect(() => {
    const fetchPartners = async () => {
      const allPartners = await getPartnersData()
      setPartners(allPartners?.partnerList || [])
    }
    fetchPartners()
  }, [])

  if (!partners.length) {
    return null // Or return a message like <p>No partners to display.</p>
  }

  return (
    <div className="w-full left-0 z-10 pt-16">
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-green-950 dark:text-white">
          Loved by teams around the world
        </h2>
        <div className="relative">
          {/* Left Fade Effect */}
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 dark:from-black dark:to-black/10 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
          <InfiniteSlider gap={10} className="my-4">
            <div className="flex flex-row flex-wrap items-center justify-center gap-x-6 sm:gap-x-10 gap-y-6 flex-shrink-0 min-w-max px-4">
              {partners.map((partner, index) => {
                //@ts-expect-error ignore logo
                if (!partner.logo?.url) {
                  return null
                }

                const partnerContent = (
                  <div className="flex flex-row items-center text-center">
                    <div className="relative w-16 h-16 mb-2 rounded-full overflow-hidden">
                      <Image
                        //@ts-expect-error ignore logoImage
                        src={partner.logo.url}
                        alt={`${partner.title} Logo`}
                        layout="fill"
                        objectFit="cover" // Adjust objectFit as needed (contain, cover, etc.)
                        priority={index < 4} // Prioritize loading for first few images
                        className="rounded-full"
                      />
                    </div>
                    <span className="pl-2 text-sm font-bold">{partner.title}</span>
                  </div>
                )

                // Render with a link if partner.link exists, otherwise just the content
                return partner.link ? (
                  <Link
                    key={partner.id || index}
                    href={partner.link}
                    target="_blank" // Open link in a new tab
                    rel="noopener noreferrer" // Security best practice for target="_blank"
                    className="transition-opacity hover:opacity-80"
                  >
                    {partnerContent}
                  </Link>
                ) : (
                  <div key={partner.id || index}>{partnerContent}</div>
                )
              })}
            </div>
          </InfiniteSlider>
          {/* Right Fade Effect */}
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l dark:from-black dark:to-black/10 from-white via-white/80 to-transparent z-10 pointer-events-none" />
        </div>
      </div>
    </div>
  )
}
