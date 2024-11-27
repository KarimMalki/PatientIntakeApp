import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserInjured, FaHome, FaBell } from 'react-icons/fa';
import { fadeIn, notificationBell, notificationDot } from '../utils/animations';

export default function PatientHeader() {
    const [notificationCount] = useState(2);
    const [showNotifications, setShowNotifications] = useState(false);

    const notifications = [
        {
            id: 1,
            message: "Upcoming appointment tomorrow at 10:00 AM",
            time: "1 hour ago",
            type: "appointment"
        },
        {
            id: 2,
            message: "New message from Dr. Wilson",
            time: "2 hours ago",
            type: "message"
        }
    ];

    return (
        <motion.header 
            className="bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-lg"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left Section */}
                    <div className="flex items-center">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link href="/" className="flex items-center hover:bg-green-700 px-3 py-2 rounded-lg mr-4">
                                <FaHome className="text-xl" />
                                <span className="ml-2 font-semibold">Home</span>
                            </Link>
                        </motion.div>
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center bg-white/10 px-3 py-1 rounded-lg"
                        >
                            <FaUserInjured className="text-xl" />
                            <span className="ml-2 font-semibold">Patient Portal</span>
                        </motion.div>
                    </div>

                    {/* Notifications */}
                    <div className="flex items-center">
                        <motion.button 
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="relative hover:bg-green-700 px-3 py-2 rounded-lg"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <motion.div variants={notificationBell} animate="animate">
                                <FaBell className="text-xl" />
                                {notificationCount > 0 && (
                                    <motion.span 
                                        variants={notificationDot}
                                        animate="animate"
                                        className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full w-4 h-4 flex items-center justify-center"
                                    >
                                        {notificationCount}
                                    </motion.span>
                                )}
                            </motion.div>
                        </motion.button>

                        <AnimatePresence>
                            {showNotifications && (
                                <motion.div 
                                    className="absolute right-4 top-16 w-80 bg-white rounded-lg shadow-xl"
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                >
                                    <div className="p-4 border-b border-gray-100">
                                        <h3 className="text-gray-900 font-semibold">Notifications</h3>
                                    </div>
                                    {notifications.map((notification, index) => (
                                        <motion.div 
                                            key={notification.id}
                                            className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <p className="text-gray-900">{notification.message}</p>
                                            <p className="text-sm text-gray-500 mt-1">{notification.time}</p>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </motion.header>
    );
}
