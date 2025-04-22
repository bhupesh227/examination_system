import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { toast } from 'sonner';
import { updateUserAvatar } from '@/lib/actions/general.action';
import { Avatar_Options, Avatar_Path } from '@/constants/avatar';
import Image from 'next/image';

interface AvatarsProps {
  currentAvatar?: string;
  userId: string;
  userName: string;
}

const Avatars = ({ currentAvatar, userId, userName }: AvatarsProps) => {
  const defaultAvatar = "/avatardefault.jpg"
  const [avatarSrc, setAvatarSrc] = React.useState<string>(currentAvatar || defaultAvatar);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const handleAvatarChange = async (avatarName: string) => {
    const newAvatar = Avatar_Path + avatarName;
    setAvatarSrc(newAvatar);
    setIsDropdownOpen(false);
    try {
      const result = await updateUserAvatar({ userId, avatarURL: newAvatar });
      if (result.success) {
        toast.success("Avatar updated successfully!");
      } else {
        toast.error("Error updating avatar. Please try again.");
      }
    } catch (error) {
      console.error("Error updating avatar:", error);
      toast.error("Error updating avatar. Please try again.");
    }
  };

  return (
    <div className="relative">
      <div onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="cursor-pointer">
        <Avatar>
          <AvatarImage src={avatarSrc} />
          <AvatarFallback>{userName ? userName.charAt(0).toUpperCase() : '?'}</AvatarFallback>
        </Avatar>
      </div>
      {isDropdownOpen && (
        <div className="absolute right-0 z-10 mt-2 w-40 bg-white border rounded shadow-lg overflow-y-auto max-h-60">
          <div className="grid grid-cols-3 max-sm:grid-cols-2 gap-2 p-2">
            {Avatar_Options.map((avatar) => (
              <Image
                src={Avatar_Path + avatar}
                alt={avatar}
                key={avatar}
                className='cursor-pointer w-10 h-10 rounded-full hover:opacity-75'
                onClick={() => handleAvatarChange(avatar)}
                width={40}
                height={40}
              />
              
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Avatars;