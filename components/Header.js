import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaHome, FaHospital } from 'react-icons/fa';

export default function Header() {
    return (
        <motion.header 
            className="bg-gray-900 text-white py-2 border-b border-gray-800"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <div className="max-w-7xl mx-auto px-4">
                <nav className="flex justify-between items-center h-12">
                    <motion.div 
                        className="flex gap-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Link href="/">
                            <motion.button 
                                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-1.5 rounded-lg text-sm transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FaHome />
                                Demo Home
                            </motion.button>
                        </Link>
                    </motion.div>
                    <motion.div 
                        className="text-center text-sm text-gray-400"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <FaHospital className="inline mr-2" />
                        Dental Care Demo
                    </motion.div>
                    <motion.div 
                        className="flex gap-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Link href="/patientview">
                            <motion.button 
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Patient Portal
                            </motion.button>
                        </Link>
                        <Link href="/dentist">
                            <motion.button 
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg text-sm transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Dentist Portal
                            </motion.button>
                        </Link>
                    </motion.div>
                </nav>
            </div>
        </motion.header>
    );
}
