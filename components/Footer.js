import { motion } from 'framer-motion';
import { FaInstagram, FaTwitter, FaFacebook, FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock, FaHeart } from 'react-icons/fa';
import { fadeIn, staggerContainer } from '../utils/animations';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        { icon: FaFacebook, href: 'https://facebook.com', color: 'hover:text-blue-500' },
        { icon: FaTwitter, href: 'https://twitter.com', color: 'hover:text-blue-400' },
        { icon: FaInstagram, href: 'https://instagram.com', color: 'hover:text-pink-500' }
    ];

    const contactInfo = [
        { icon: FaMapMarkerAlt, text: '123 Dental Street, Medical District' },
        { icon: FaPhone, text: '(555) 123-4567' },
        { icon: FaEnvelope, text: 'contact@dentalcare.com' },
        { icon: FaClock, text: 'Mon-Fri: 9:00 AM - 6:00 PM' }
    ];

    return (
        <motion.footer 
            className="bg-gray-900 text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="max-w-7xl mx-auto px-4 py-12">
                <motion.div 
                    className="grid grid-cols-1 md:grid-cols-4 gap-8"
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                >
                    {/* About Section */}
                    <motion.div variants={fadeIn}>
                        <h3 className="text-xl font-bold mb-4">Dental Care</h3>
                        <p className="text-gray-400 mb-4">
                            A modern patient management system demo showcasing advanced web development techniques.
                        </p>
                        <motion.div 
                            className="flex space-x-4"
                            variants={staggerContainer}
                        >
                            {socialLinks.map((social, index) => (
                                <motion.a
                                    key={index}
                                    href={social.href}
                                    className={`text-gray-400 ${social.color} transition-colors`}
                                    whileHover={{ scale: 1.2, rotate: 5 }}
                                    whileTap={{ scale: 0.9 }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <social.icon size={24} />
                                </motion.a>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div variants={fadeIn}>
                        <h3 className="text-xl font-bold mb-4">Demo Features</h3>
                        <motion.ul 
                            className="space-y-2"
                            variants={staggerContainer}
                        >
                            {['Patient Portal', 'Dentist Portal', 'Appointment Booking', 'Medical Records'].map((item, index) => (
                                <motion.li
                                    key={index}
                                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                                    whileHover={{ x: 5 }}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    {item}
                                </motion.li>
                            ))}
                        </motion.ul>
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div variants={fadeIn}>
                        <h3 className="text-xl font-bold mb-4">Demo Contact</h3>
                        <motion.ul 
                            className="space-y-4"
                            variants={staggerContainer}
                        >
                            {contactInfo.map((info, index) => (
                                <motion.li
                                    key={index}
                                    className="flex items-center text-gray-400"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <info.icon className="mr-2" />
                                    {info.text}
                                </motion.li>
                            ))}
                        </motion.ul>
                    </motion.div>

                    {/* Demo Note */}
                    <motion.div variants={fadeIn}>
                        <h3 className="text-xl font-bold mb-4">Demo Note</h3>
                        <p className="text-gray-400">
                            This is a demonstration application. All data and functionality are simulated for showcase purposes.
                        </p>
                    </motion.div>
                </motion.div>

                {/* Bottom Bar */}
                <motion.div 
                    className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <motion.p
                        whileHover={{ scale: 1.02 }}
                    >
                        © {currentYear} Dental Care Demo. All rights reserved.
                    </motion.p>
                    <motion.p 
                        className="mt-2 text-sm flex items-center justify-center"
                        whileHover={{ scale: 1.02 }}
                    >
                        Made with 
                        <motion.span
                            animate={{ 
                                scale: [1, 1.2, 1],
                            }}
                            transition={{ 
                                duration: 1,
                                repeat: Infinity,
                            }}
                            className="mx-1"
                        >
                            <FaHeart className="inline text-red-500" />
                        </motion.span>
                        using modern web technologies
                    </motion.p>
                </motion.div>
            </div>
        </motion.footer>
    );
}
