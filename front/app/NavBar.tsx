"use client";
import React, { useState, useEffect, useRef, ReactNode, ComponentType } from 'react';
import Animate from './Animate';
import Link from 'next/link';
import { cn } from './globals';
import "./globals.css";

import MenuIcon from '@mui/icons-material/Menu';


interface NavItemProps {
    href: string,
    children: React.ReactNode,
    className?: string,
}
const NavItem: React.FC<NavItemProps> = ({ href, children, className }) => {
    return <Animate
        href={href}
        Component={Link}
        animation={'animate-[click-sm_0.2s_ease-in-out]'}
        className='transition-colors bg-secondary rounded p-1 hover:bg-accent'
    >
        {children}
    </Animate>
}

const navItems = [
    { title: 'home', href: '/' },
    { title: 'profile', href: '/profile' },
    { title: 'new', href: '/new' },
    { title: 'about', href: '/about' },
]

export default function NavBar() {
    const [menuOpen, setMenuOpen] = useState(false);

    return <div className="w-full bg-primary">

        <Animate
            Component={MenuIcon}
            animation={'animate-[click-md_0.2s_ease-in-out]'}
            onClick={() => setMenuOpen(!menuOpen)}
            className='m-2 md:hidden text-secondary cursor-pointer'>
        </Animate>

        <div className='m-2 hidden md:flex gap-2'>
            {navItems.map((e, k) => <NavItem key={`${k}_navItem`} href={e.href}>{e.title}</NavItem>)}
        </div>
        <div className={cn('overflow-hidden transition-h', menuOpen ? 'max-h-[1000px]' : 'max-h-[0px]')}>
            <div className={'mx-2 mb-2 flex md:hidden flex-col gap-2'}>
                {navItems.map((e, k) => <NavItem key={`${k}_navItem_mobile`} href={e.href}>{e.title}</NavItem>)}
            </div>
        </div>
    </div>;
};
