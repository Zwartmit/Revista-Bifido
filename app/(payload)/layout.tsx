import config from '@/payload/payload.config'
import '@payloadcms/next/css'
import '@/payload/admin-custom.css'
import { RootLayout } from '@payloadcms/next/layouts'
import React from 'react'

/* @ts-ignore - Importing from internal path because it is not exported publicly */
/* @ts-ignore - Importing from internal path because it is not exported publicly */
import { handleServerFunctions } from '../../node_modules/@payloadcms/next/dist/utilities/handleServerFunctions'
import { importMap } from './admin/importMap'

const serverFunction = async (payload: any) => {
    'use server'
    return handleServerFunctions({
        ...payload,
        config,
    })
}

const Layout = ({ children }: { children: React.ReactNode }) => (
    <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
        {children}
    </RootLayout>
)

export default Layout
