"use client"
import React, { useState } from 'react'
import { MobileNav, MobileNavHeader, MobileNavMenu, MobileNavToggle, NavbarButton, NavbarHead, NavbarLogo, NavBody, NavItems } from './ui/ResisableNavbar';
import { usePathname, useRouter } from 'next/navigation';
import { LogOutSession } from '@/lib/actions/auth.action';
import { toast } from 'sonner';
import { navigationItems } from '@/constants';
import Avatars from './Avatars';



const Navbar = ({user}:{user:User}) => {
    const navItems = navigationItems;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const isAuthPage = pathname === "/sign-in" || pathname === "/sign-up";
    const handleLogOut = async () => {
        try {
            setIsLoading(true);
            await LogOutSession();
            toast.success("Logged out successfully.");
            router.push("/sign-in");
        } catch (error) {
            console.error("Logout error:", error);
            toast.error("Logout failed. Please try again.");
        }finally{
            setIsLoading(false);
        }
    }
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
                    <NavbarButton variant="destructive" disabled={isLoading} onClick={handleLogOut}>LogOut</NavbarButton>
                </>
            )}
            
          </div>
        </NavBody>
 
        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <div className="flex items-center gap-6">
              <Avatars userId={user.id} userName={user.username} currentAvatar={user.avatarURL}/>
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
                    <NavbarButton variant="destructive" disabled={isLoading} className='w-full' onClick={handleLogOut}>LogOut</NavbarButton>
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