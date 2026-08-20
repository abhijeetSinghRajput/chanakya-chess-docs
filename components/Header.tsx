import React from 'react'
import { ThemeToggleButton3 } from './skipper/toggle-button'
import Image from 'next/image'
import Link from 'next/dist/client/link'

const Header = () => {
    return (
        <header className="w-full sticky h-16 z-50 top-4 right-4">
            <div className="px-6 w-full max-w-6xl mx-auto flex items-center justify-between gap-x-4">
                <Link href="/">
                    <Image
                        src="/chanakya-logo.png"
                        alt="Chanakya chess engine logo"
                        width={40}
                        height={40}
                    />
                </Link>
                <div className="flex items-center gap-x-4">
                    <ThemeToggleButton3
                        className="size-10 p-1"
                    />
                </div>
            </div>
        </header>
    )
}

export default Header
