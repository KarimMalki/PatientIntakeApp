import { motion } from 'framer-motion';
import Link from "next/link";
import { FaUserMd, FaUserInjured, FaCalendarAlt, FaCode, FaGithub } from 'react-icons/fa';
import { fadeIn, staggerContainer, cardHover } from '../utils/animations';

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
            {/* Demo Banner */}
            <motion.div 
                className="bg-indigo-600 text-white px-4 py-2 text-center"
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <p className="text-sm">
                    <FaCode className="inline-block mr-2" />
                    This is a demo application showcasing modern web development techniques
                    <FaGithub className="inline-block ml-2" />
                </p>
            </motion.div>

            {/* Hero Section */}
            <div className="relative bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
                        variants={staggerContainer}
                        initial="initial"
                        animate="animate"
                    >
                        <motion.div variants={fadeIn}>
                            <div className="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                                Demo Application
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                                Patient Check-in <span className="text-blue-600">Demo Portal</span>
                            </h1>
                            <p className="text-lg text-gray-600 mb-8">
                                Explore this demo of a modern patient management system. Test both patient and dentist interfaces with sample data.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Link href="/patientview">
                                        <button className="w-full sm:w-auto bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                                            <FaUserInjured className="mr-2" />
                                            Try Patient Portal
                                        </button>
                                    </Link>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Link href="/dentist">
                                        <button className="w-full sm:w-auto bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center">
                                            <FaUserMd className="mr-2" />
                                            Try Dentist Portal
                                        </button>
                                    </Link>
                                </motion.div>
                            </div>
                        </motion.div>
                        <motion.div 
                            className="relative"
                            variants={fadeIn}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <div className="relative bg-gradient-to-br from-blue-100 to-blue-50 p-8 rounded-2xl shadow-2xl">
                                <motion.div 
                                    className="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full opacity-50 -mr-16 -mt-16"
                                    animate={{ 
                                        scale: [1, 1.2, 1],
                                        rotate: [0, 90, 0] 
                                    }}
                                    transition={{ 
                                        duration: 20,
                                        repeat: Infinity,
                                        ease: "linear"
                                    }}
                                />
                                <motion.div 
                                    className="absolute bottom-0 left-0 w-24 h-24 bg-green-200 rounded-full opacity-50 -ml-12 -mb-12"
                                    animate={{ 
                                        scale: [1, 1.3, 1],
                                        rotate: [0, -90, 0]
                                    }}
                                    transition={{ 
                                        duration: 15,
                                        repeat: Infinity,
                                        ease: "linear"
                                    }}
                                />
                                
                                <div className="relative space-y-6">
                                    <motion.div 
                                        className="bg-white p-6 rounded-xl shadow-md"
                                        variants={cardHover}
                                        whileHover="hover"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="bg-green-100 p-3 rounded-full">
                                                <FaCalendarAlt className="text-green-600 text-xl" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Demo Features</p>
                                                <p className="font-semibold text-gray-900">Appointment Booking</p>
                                            </div>
                                        </div>
                                    </motion.div>

                                    <motion.div 
                                        className="bg-white p-6 rounded-xl shadow-md"
                                        variants={cardHover}
                                        whileHover="hover"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="bg-blue-100 p-3 rounded-full">
                                                <FaUserMd className="text-blue-600 text-xl" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Demo Access</p>
                                                <p className="font-semibold text-gray-900">Multiple User Roles</p>
                                            </div>
                                        </div>
                                    </motion.div>

                                    <motion.div 
                                        className="bg-white p-6 rounded-xl shadow-md"
                                        variants={cardHover}
                                        whileHover="hover"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="bg-purple-100 p-3 rounded-full">
                                                <FaCode className="text-purple-600 text-xl" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Try It Out</p>
                                                <p className="font-semibold text-gray-900">Sample Data Included</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Features Section */}
                <motion.div 
                    className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900">Demo Features</h2>
                        <p className="text-gray-600 mt-2">Explore these key features in our demo application</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((index) => (
                            <motion.div
                                key={index}
                                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                                variants={cardHover}
                                whileHover="hover"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                                    <FaCalendarAlt className="text-blue-600 text-xl" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Feature {index}</h3>
                                <p className="text-gray-600">Interactive demo showcasing modern web development techniques.</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Demo Note */}
                <motion.div 
                    className="bg-gray-50 border-t border-gray-100"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <p className="text-center text-sm text-gray-600">
                            This is a demonstration application. No real medical data is stored or processed.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
