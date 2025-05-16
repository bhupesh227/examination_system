import Image from 'next/image';
import React from 'react'
import { Button } from './ui/button';

interface VerificationScreenProps {
  userEmail: string;
  isResending: boolean;
  isChecking: boolean;
  onResendVerification: () => Promise<void>;
  onCheckVerification: () => Promise<void>;
  onBackToSignIn: () => void;
}

const VerificationScreen = ({
  userEmail,
  isResending,
  isChecking,
  onResendVerification,
  onCheckVerification,
  onBackToSignIn,
}: VerificationScreenProps) => {
  return (
    <div className="card-border md:w-[450px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <>
            <div className="flex items-center justify-center">
                <Image src="/logo.svg" alt="PYTAI logo" width={140} height={50} />
            </div>
            <h3 className="text-center">Email Verification Required</h3>
        </>

        <div className="text-center">
            <p className="mb-4">
                A verification email has been sent to: { }
                <span className=" text-primary-200 text-xl font-semibold">{userEmail}</span>
            </p>
            
            <p className="mb-6 text-sm text-light-300">
                Please check your inbox and click the verification link.
                If you don&apos;t see the email, check your spam folder.
            </p>
            
            <div className="flex flex-col gap-4 items-center">
                <Button 
                    onClick={onResendVerification} 
                    disabled={isResending}
                    className="btn-secondary"
                >
                    {isResending ? "Sending..." : "Resend Verification Email"}
                </Button>
                
                <Button 
                    onClick={onCheckVerification}
                    disabled={isChecking}
                    className="btn-primary"
                >
                    {isChecking ? "Checking..." : "I've Verified My Email"}
                </Button>
                
                <Button 
                    variant="outline" 
                    onClick={onBackToSignIn}
                    className="mt-2 w-full hover:bg-slate-800 cursor-pointer"
                    type="button"
                >
                    Back to Log In
                </Button>
            </div>
        </div>
      </div>
    </div>
  )
}

export default VerificationScreen