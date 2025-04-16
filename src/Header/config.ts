import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
    update: isAdminOrEditor,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
    {
      name: 'logoImage',
      type: 'upload',
      label: 'business image',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'siteName',
      label: 'Site Name',
      type: 'text',
      required: true,
      defaultValue: 'Lilies Tech zone',
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
