"use client";
import { SideBarLinks } from '@/constants';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'

interface SidebarProps {
    username:string;
    email:string;
}

const Sidebar = ({username,email}:SidebarProps) => {
    const pathname = usePathname();
    return (
      <div className='sticky left-0 top-0 flex h-full flex-col justify-between px-5 pb-5 pt-10 bg-orange-100 rounded-lg'>
          <div>
              <Link href={"/"} className='teacher-logo'>
                  <Image src="/logo.svg" alt="logo" width={37} height={37}/>
                  <h1 className='text-primary-200 font-bold'>ExamDo</h1>
              </Link>
              <div className='mt-10 flex flex-col gap-5'>
                  {SideBarLinks.map((link)=>{
                      const isSelected =
                      link.route === '/teacher-dashboard'
                        ? pathname === '/teacher-dashboard'
                        : pathname.startsWith(link.route);
  
                      return (
                          <Link href={link.route} key={link.route}>
                              <div className={cn("link", isSelected && "violet-gradient-gunmetal shadow-2xl rounded-lg",)}>
                                  <div className='relative size-5'>
                                      <Image src={link.img} alt='icon' fill 
                                          className={`${isSelected ? 'brightness-0 invert' : ''} object-contain`}/>
                                  </div>
                                  <p className={cn(isSelected ? "text-white font-semibold" :  " font-semibold text-dark-200")}>
                                      {link.text}
                                  </p>
                              </div>
                          </Link>
                      );
                  })}
              </div>
          </div>
          <div className="my-8 flex w-full flex-row justify-center items-center gap-2 rounded-full border border-light-400 px-6 py-2 shadow-sm">
                <div className="flex flex-col justify-center items-center">
                    <p className="font-semibold text-dark-200">{username}</p>
                    <p className="text-xs text-light-800">{email}</p>
                </div>
         </div>
      </div>
  )
}

export default Sidebar
