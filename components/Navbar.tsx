"use client"
import React, { useState } from 'react'
import { MobileNav, MobileNavHeader, MobileNavMenu, MobileNavToggle, NavbarButton, NavbarHead, NavbarLogo, NavBody, NavItems } from './ui/ResisableNavbar';
import { usePathname, useRouter } from 'next/navigation';
import { LogOutSession } from '@/lib/actions/auth.action';
import { toast } from 'sonner';
import { navigationItems } from '@/constants';


const Navbar = () => {
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
                    <NavbarButton variant="primary">Book a call</NavbarButton>
                    <NavbarButton variant="destructive" disabled={isLoading} onClick={handleLogOut}>LogOut</NavbarButton>
                </>
            )}
            
          </div>
        </NavBody>
 
        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
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
                    <NavbarButton variant="primary" className='w-full' onClick={() => setIsMobileMenuOpen(false)}>Book a call</NavbarButton>
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