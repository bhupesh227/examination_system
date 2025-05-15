"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PanelRightOpen } from "lucide-react";
import StudentSidebar from "./StudentSidebar";

interface StudentSidebarContainerProps {
    username: string;
    email: string;
}

const StudentSidebarContainer = ({ username, email }: StudentSidebarContainerProps) => {
    const [open, setOpen] = useState(false);

    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    };

    const sidebarVariants = {
        hidden: { x: "-100%" },
        visible: { x: "0%" },
    };

    return (
        <>
            
            <div className=" p-0">
                <button
                    onClick={() => setOpen(true)}
                    className="p-2 bg-teal-600 text-white rounded font-serif flex flex-col justify-center items-center gap-2"
                >
                    <PanelRightOpen /> 
                </button>
            </div>

            <AnimatePresence>
                {open && (
                    <>
                       
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={overlayVariants}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 bg-black bg-opacity-100 min-h-screen z-40"
                            onClick={() => setOpen(false)}
                        />
                       
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={sidebarVariants}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed inset-y-0 left-0 z-50 w-64 md:w-100 bg-white shadow-lg rounded-2xl"
                        >
                            <div className="p-4 h-full overflow-y-auto pb-6">
                                <button
                                    onClick={() => setOpen(false)}
                                    className="mb-4 p-2 bg-red-500 text-white rounded"
                                >
                                    Close
                                </button>
                                <StudentSidebar username={username} email={email} />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default StudentSidebarContainer;