import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserMd, FaHome, FaCalendarAlt, FaClipboardList, FaCog, FaChartLine } from 'react-icons/fa';
import { fadeIn, cardHover } from '../utils/animations';

export default function DentistHeader() {
    const navItems = [
        { href: '/dentist', icon: FaClipboardList, text: 'Dashboard' },
        { href: '/dentist/appointments', icon: FaCalendarAlt, text: 'Appointments' },
        { href: '/dentist/analytics', icon: FaChartLine, text: 'Analytics' }
    ];

    const handleSettingsClick = () => {
        alert('Settings panel would open here');
    };

    return (
        <motion.header 
            className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left Section */}
                    <div className="flex items-center">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link href="/" className="flex items-center hover:bg-blue-700 px-3 py-2 rounded-lg mr-4">
                                <FaHome className="text-xl" />
                                <span className="ml-2 font-semibold">Home</span>
                            </Link>
                        </motion.div>
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center bg-white/10 px-3 py-1 rounded-lg"
                        >
                            <FaUserMd className="text-xl" />
                            <span className="ml-2 font-semibold">Dentist Portal</span>
                        </motion.div>
                    </div>

                    {/* Center Navigation */}
                    <nav className="hidden md:flex items-center space-x-4">
                        {navItems.map((item, index) => (
                            <motion.div
                                key={item.href}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link href={item.href}>
                                    <motion.div 
                                        className="flex items-center hover:bg-blue-700 px-3 py-2 rounded-lg cursor-pointer"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <item.icon className="mr-2" />
                                        {item.text}
                                    </motion.div>
                                </Link>
                            </motion.div>
                        ))}
                    </nav>

                    {/* Settings */}
                    <motion.div 
                        className="flex items-center"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <motion.button 
                            onClick={handleSettingsClick}
                            className="hover:bg-blue-700 px-3 py-2 rounded-lg flex items-center"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FaCog className="text-xl" />
                            <span className="ml-2 hidden md:inline">Settings</span>
                        </motion.button>
                    </motion.div>
                </div>
            </div>

            {/* Mobile Navigation */}
            <motion.div 
                className="md:hidden border-t border-blue-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <nav className="flex justify-around py-2">
                    {navItems.map((item, index) => (
                        <Link key={item.href} href={item.href}>
                            <motion.div
                                className="flex flex-col items-center px-3 py-2"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <item.icon className="text-xl mb-1" />
                                <span className="text-xs">{item.text}</span>
                            </motion.div>
                        </Link>
                    ))}
                    <motion.button
                        className="flex flex-col items-center px-3 py-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSettingsClick}
                    >
                        <FaCog className="text-xl mb-1" />
                        <span className="text-xs">Settings</span>
                    </motion.button>
                </nav>
            </motion.div>
        </motion.header>
    );
}
