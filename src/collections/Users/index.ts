import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { onlyAdmins } from '@/access/onlyAdmins'
import { only } from 'node:test'
import { isAdmin } from '@/access/isAdmin'
import { anyone } from '@/access/anyone'
import { isAdminOrSeft } from '@/access/adminOrSeft'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: isAdmin,
    create: anyone,
    delete: isAdminOrSeft,
    read: authenticated,
    update: isAdminOrSeft,
  },
  admin: {
    defaultColumns: ['firstname', 'email'],
    useAsTitle: 'email',
  },
  auth: {
    tokenExpiration: 7200, // How many seconds to keep the user logged in
    verify: true, // Require email verification before being allowed to authenticate
    maxLoginAttempts: 5, // Automatically lock a user out after X amount of failed logins
    lockTime: 600 * 1000, // Time period to allow the max login attempts
    // More options are available
  },
  fields: [
    {
      name: 'firstname',
      required: true,
      label: 'First name',
      type: 'text',
    },
    {
      name: 'lastname',
      required: true,
      label: 'Last name',
      type: 'text',
    },
    {
      name: 'gender',
      label: 'Gender',
      type: 'select',
      options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
      ],
    },
    {
      name: 'phoneNumber',
      label: 'Phone number',
      type: 'text',
    },
    {
      name: 'subscribedToNewsletter',
      label: 'Subscribed to newsletter',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'roles',
      label: 'Role',
      saveToJWT: true,
      type: 'select',
      required: true,
      access: {
        create: onlyAdmins,
        update: onlyAdmins,
      },
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'subscriber', value: 'subscriber' },
        { label: 'Editor', value: 'editor' },
      ],
      defaultValue: 'subscriber',
    },
  ],
  timestamps: true,
}
