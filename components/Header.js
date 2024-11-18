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
        <header className="bg-blue-900 text-white py-4 shadow-md">
            <nav className="container mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
                        <Image src="/portrait1.jpg" alt="Logo" width={40} height={40} className="object-cover" />
                    </div>

                    <div className="relative">
                        <h1 className="absolute text-lg font-cursive text-white font-bold transform -translate-y-3 -translate-x-2 mt-2">
                            Amer
                        </h1>
                        <h1 className="text-lg font-bold font-cursive mt-2.5">Ammari</h1>
                    </div>
                </div>

                <div className="flex items-center space-x-6">
                    <div className="flex space-x-4">
                        <a href="mailto:your-email@gmail.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">
                            <EmailIcon />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">
                            <LinkedInIcon />
                        </a>
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">
                            <GitHubIcon />
                        </a>
                    </div>

                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="hover:text-gray-400 focus:outline-none"
                    >
                        {isMenuOpen ? <CloseIcon fontSize="large" /> : <MenuIcon fontSize="large" />}
                    </button>
                </div>
            </nav>

            {isMenuOpen && (
                <div className="absolute right-4 top-16 bg-black text-white shadow-md rounded-lg w-48 py-2">
                    <Link href="/about" className="block px-4 py-2 hover:bg-gray-700">
                        about
                    </Link>
                    <Link href="/book" className="block px-4 py-2 hover:bg-gray-700">
                        book
                    </Link>
                    <Link href="/portfolio" className="block px-4 py-2 hover:bg-gray-700">
                        portfolio
                    </Link>
                    <Link href="/blog" className="block px-4 py-2 hover:bg-gray-700">
                        blog
                    </Link>
                    <Link href="/contact" className="block px-4 py-2 hover:bg-gray-700">
                        contact
                    </Link>
                </div>
            )}
        </header>
    );
}
