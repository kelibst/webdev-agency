'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'
import { Button } from '@/components/ui/button'
import { MenuIcon, SearchIcon } from 'lucide-react'
import { themeLocalStorageKey } from '@/providers/Theme/shared'
import { useTheme } from '@/providers/Theme'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const [theme, setValue] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const preference = window.localStorage.getItem(themeLocalStorageKey)
    setValue(preference ?? 'auto')
  }, [])

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsMobileMenuOpen(false)
    }
  }
  const handleScroll = () => {
    setIsMobileMenuOpen(false)
  }

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.addEventListener('click', handleClickOutside)
      window.addEventListener('scroll', handleScroll)
    } else {
      document.removeEventListener('click', handleClickOutside)
      window.removeEventListener('scroll', handleScroll)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isMobileMenuOpen])
  console.log(theme, 'theme')
  return (
    <header className="flex justify-between py-4 px-2 sm:px-0 lg:px-12 relative">
      <div className="flex items-center justify-between relative">
        <Link className="flex items-center" href="/">
          <Logo
            loading="eager"
            priority="high"
            className=" dark:invert-0 h-[60px] sm:h-auto"
            //@ts-expect-error - theme is not null
            theme={theme}
            //@ts-expect-error - logoImage is not null
            logoImage={data?.logoImage}
          />
          <h1 className="ml-2 font-pacifico text-lg">
            {data?.siteName ? data?.siteName : 'Lilies Tech zone'}
          </h1>
        </Link>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden sm:flex">
        <HeaderNav data={data} />
      </div>
      <div className="hidden sm:flex gap-2 justify-between items-center">
        <Link href="/search">
          <Button variant="outline" size="sm" className="rounded-xl">
            <SearchIcon className="mr-2" />
            <span>Search</span>
          </Button>
        </Link>
        <Link href="/auth/login">
          <Button variant="outline" size="sm" className="rounded-xl">
            Get Started
          </Button>
        </Link>
      </div>
      {/* Mobile Navigation */}
      <button
        className="sm:hidden text-primary-foreground hover:text-secondary  focus:outline-none"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {/* Hamburger Icon */}
        <MenuIcon className="w-6 h-6" />
      </button>

      {/* Mobile Menu Content */}
      {isMobileMenuOpen && (
        <div
          ref={menuRef} // Attach the ref to the mobile menu
          className="absolute top-12 right-0 w-48 bg-white dark:bg-black dark:text-white shadow-md rounded-md z-50"
        >
          <ul className="py-2">
            {data.navItems?.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.link?.url || ''}
                  className="block px-4 py-2 "
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.link.label} {/* Access label from item.link */}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex flex-col sm:hidden py-3">
            <div>
              <Link href="/search">
                <Button variant="ghost" size="sm">
                  <SearchIcon className="w-4 h-4 mr-2" />
                  <span>Search</span>
                  {/* Add icon */}
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
