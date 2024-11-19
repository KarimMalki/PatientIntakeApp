import { FaInstagram, FaTwitter, FaFacebook, FaEnvelope } from "react-icons/fa";

export default function Footer() {
    const handleScrollToSection = (sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <footer className="bg-gray-400 text-gray-300 py-8">
            <div className="container mx-auto flex flex-col items-center space-y-6">
                {/* Top Sections in a Row */}
                <div className="flex flex-col md:flex-row justify-center items-center w-full md:space-x-10 px-4">
                    {/* Quick Links Section */}
                    <div className="text-center md:flex-1 px-4">
                        <h2 className="text-lg font-semibold text-gray-100 mb-4">Quick Links</h2>
                        <div className="flex flex-col space-y-2">
                            <button
                                onClick={() => handleScrollToSection("section1")}
                                className="text-gray-300 hover:text-gray-100"
                            >
                                Section 1
                            </button>
                            <button
                                onClick={() => handleScrollToSection("section2")}
                                className="text-gray-300 hover:text-gray-100"
                            >
                                Section 2
                            </button>
                        </div>
                    </div>

                    {/* Social Media Section */}
                    <div className="text-center md:flex-1 px-4">
                        <h2 className="text-lg font-semibold text-gray-100 mb-4">Social Media</h2>
                        <div className="flex justify-center space-x-6">
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-300 hover:text-gray-100"
                            >
                                <FaInstagram size={24} />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-300 hover:text-gray-100"
                            >
                                <FaTwitter size={24} />
                            </a>
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-300 hover:text-gray-100"
                            >
                                <FaFacebook size={24} />
                            </a>
                        </div>
                    </div>

                    {/* Contact Section */}
                    <div className="text-center md:flex-1 px-4">
                        <h2 className="text-lg font-semibold text-gray-100 mb-4">Contact</h2>
                        <a
                            href="mailto:example@example.com"
                            className="text-gray-300 hover:text-gray-100"
                        >
                            <FaEnvelope size={18} className="inline-block mr-2" />
                            example@example.com
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
