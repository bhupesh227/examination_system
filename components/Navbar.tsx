"use client"
import React, { useState } from 'react'
import { MobileNav, MobileNavHeader, MobileNavMenu, MobileNavToggle, NavbarButton, NavbarHead, NavbarLogo, NavBody, NavItems } from './ui/ResisableNavbar';
import { usePathname, } from 'next/navigation';


import Avatars from './Avatars';
import { adminNavItems, studentNavItems, teacherNavItems } from '@/constants';

const Navbar = ({user}:{user:UserInfo}) => {
    const navItems =
      user.role === "student"
          ? studentNavItems
          : user.role === "admin"
              ? adminNavItems
              : user.role === "teacher"
                  ? teacherNavItems
                  : [];
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const isAuthPage = pathname === "/sign-in" || pathname === "/sign-up";
    
  return (
    <div className="relative w-full">
      <NavbarHead>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          {!isAuthPage && <NavItems items={navItems} />}
          <div className="flex items-center gap-4">
            {isAuthPage ? (
                <>
                    <NavbarButton variant="primary" href='/sign-in' >
                        Login
                    </NavbarButton>
                    <NavbarButton variant="primary" href='/sign-up'>
                        Sign Up
                    </NavbarButton>
                </>
            ):(
                <>
                    <Avatars userId={user.id} userName={user.username} currentAvatar={user.avatarURL}/>
                    <NavbarButton variant="destructive"  href='/my-profile' className='rounded-full'>
                      
                          <span className="block">Profile</span>
                      
                    </NavbarButton>
                </>
            )}
            
          </div>
        </NavBody>
 
        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <div className="flex items-center gap-6">
              {!isAuthPage &&(
                <Avatars userId={user.id} userName={user.username} currentAvatar={user.avatarURL}/>
              )}
              <MobileNavToggle
                isOpen={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              />
            </div>
            
          </MobileNavHeader>
 
          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {!isAuthPage && navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
              {isAuthPage ?(
                <>
                    <NavbarButton variant="secondary" className='w-full' href={'/sign-in'} onClick={() => setIsMobileMenuOpen(false)}>
                        Login
                    </NavbarButton>
                    <NavbarButton variant="primary" className='w-full' href='/sign-up' onClick={() => setIsMobileMenuOpen(false)}>
                        Sign Up
                    </NavbarButton>
                </>
              ):(
                <>
                  <NavbarButton variant="destructive"  href='/my-profile' className='rounded-full'>
                    <span className="block">Profile</span>
                  </NavbarButton>
                </>
              )}
            </div>
          </MobileNavMenu>
        </MobileNav>
      </NavbarHead>
    </div>

    
  )
}

export default Navbar