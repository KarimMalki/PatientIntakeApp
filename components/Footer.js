import { FaInstagram, FaTwitter, FaFacebook, FaEnvelope } from "react-icons/fa";

export default function Footer() {
    const handleScrollToSection = (sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <footer className="bg-gray-800 text-white py-8">
            <div className="container mx-auto flex flex-col items-center space-y-6">
                {/* Top Sections in a Row */}
                <div className="flex flex-col md:flex-row justify-center items-center w-full md:space-x-10 px-4">
                    {/* Quick Links Section */}
                    <div className="text-center md:flex-1 px-4">
                        <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
                        <div className="flex flex-col space-y-2">
                            <button
                                onClick={() => handleScrollToSection("experience")}
                                className="text-white hover:underline"
                            >
                                Experience
                            </button>
                            <button
                                onClick={() => handleScrollToSection("education")}
                                className="text-white hover:underline"
                            >
                                Education
                            </button>
                        </div>
                    </div>

                    {/* Social Media Section */}
                    <div className="text-center md:flex-1 px-4">
                        <h2 className="text-lg font-semibold mb-4">Social Media</h2>
                        <div className="flex justify-center space-x-6">
                            <a
                                href="https://instagram.com/yourusername"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white hover:text-gray-400"
                            >
                                <FaInstagram size={24} />
                            </a>
                            <a
                                href="https://twitter.com/yourusername"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white hover:text-gray-400"
                            >
                                <FaTwitter size={24} />
                            </a>
                            <a
                                href="https://facebook.com/yourusername"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white hover:text-gray-400"
                            >
                                <FaFacebook size={24} />
                            </a>
                        </div>
                    </div>


                    {/* Contact Me Section */}
                    <div className="text-center md:flex-1 px-4">
                        <h2 className="text-lg font-semibold mb-4">Contact Me</h2>
                        <a
                            href="mailto:your-email@gmail.com"
                            className="text-white hover:underline"
                        >
                            <FaEnvelope size={18} className="inline-block mr-2" />
                            your-email@gmail.com
                        </a>
                    </div>
                </div>

                {/* Powered By Section */}
                <div className="text-center text-gray-500">
                    <p>Powered by Levant Labs</p>
                </div>
            </div>
        </footer>
    );
}
