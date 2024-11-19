"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

// Social Media Icons
import EmailIcon from "@mui/icons-material/Email";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="bg-gray-100 text-gray-900 py-4 shadow-sm">
            <nav className="container mx-auto flex justify-between items-center px-4">
                {/* Logo */}
                <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-gray-300">
                        <Image src="/placeholder-logo.jpg" alt="Logo" width={40} height={40} className="object-cover" />
                    </div>

                    {/* Title */}
                    <div>
                        <h1 className="text-lg font-semibold leading-none">
                            Site <span className="font-bold">Title</span>
                        </h1>
                    </div>
                </div>

                {/* Social Icons and Menu */}
                <div className="flex items-center space-x-4">
                    <div className="hidden md:flex space-x-4">
                        <a
                            href="mailto:example@example.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-700 hover:text-gray-500"
                        >
                            <EmailIcon />
                        </a>
                        <a
                            href="https://linkedin.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-700 hover:text-gray-500"
                        >
                            <LinkedInIcon />
                        </a>
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-700 hover:text-gray-500"
                        >
                            <GitHubIcon />
                        </a>
                    </div>

                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="text-gray-700 hover:text-gray-500 md:hidden"
                    >
                        {isMenuOpen ? <CloseIcon fontSize="large" /> : <MenuIcon fontSize="large" />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="absolute right-4 top-16 bg-white text-gray-900 shadow-lg rounded-lg w-48 py-2 border border-gray-200">
                    <Link href="/about" className="block px-4 py-2 hover:bg-gray-100">
                        About
                    </Link>
                    <Link href="/services" className="block px-4 py-2 hover:bg-gray-100">
                        Services
                    </Link>
                    <Link href="/portfolio" className="block px-4 py-2 hover:bg-gray-100">
                        Portfolio
                    </Link>
                    <Link href="/blog" className="block px-4 py-2 hover:bg-gray-100">
                        Blog
                    </Link>
                    <Link href="/contact" className="block px-4 py-2 hover:bg-gray-100">
                        Contact
                    </Link>
                </div>
            )}
        </header>
    );
}
