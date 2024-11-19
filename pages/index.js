"use client";

import { useState } from "react";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import Link from "next/link";

export default function Home({ workRef, aboutRef, skillRef, headerRef, experienceRef }) {
    // State for dropdown or other controls
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    // Static data (placeholders for template)
    const headerTaglineTwo = "Your Name";
    const headerTaglineThree = "Your Title";
    const headerTaglineFour = "Location or Tagline";
    const aboutpara = "This is a brief introduction about yourself. Describe your skills, experience, and passion for the work you do.";
    const aboutpara2 = "Additional details about your background or interests.";

    const projects = [
        {
            id: 1,
            title: "Project Title 1",
            description: "Brief description of the project.",
            imageSrc: "https://via.placeholder.com/300",
            url: "#",
        },
        {
            id: 2,
            title: "Project Title 2",
            description: "Brief description of the project.",
            imageSrc: "https://via.placeholder.com/300",
            url: "#",
        },
    ];

    const services = [
        {
            title: "Skill or Service 1",
            description: "Brief description of the skill or service.",
        },
        {
            title: "Skill or Service 2",
            description: "Brief description of the skill or service.",
        },
    ];

    const experiences = [
        { title: "Company Name", position: "Position Title", point1: "Highlight 1", point2: "Highlight 2" },
        { title: "Company Name", position: "Position Title", point1: "Highlight 1", point2: "Highlight 2" },
    ];

    const socials = [
        { title: "LinkedIn", link: "#" },
        { title: "GitHub", link: "#" },
    ];

    return (
        <div className="text-black bg-gray-200 font-sans">
            {/* Header Section */}
            <div className="container mx-auto py-10" ref={headerRef}>
                <div className="flex flex-col md:flex-row items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold">{headerTaglineTwo}</h1>
                        <h2 className="text-3xl">{headerTaglineThree}</h2>
                        <h3 className="text-xl">{headerTaglineFour}</h3>

                        {/* Social Links */}
                        <div className="mt-4 flex space-x-4">
                            {socials.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-700 hover:underline"
                                >
                                    {social.title === "LinkedIn" && <FaLinkedin className="inline-block mr-2" />}
                                    {social.title === "GitHub" && <FaGithub className="inline-block mr-2" />}
                                    {social.title}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Placeholder Image */}
                    <div className="mt-6 md:mt-0">
                        <img
                            src="https://via.placeholder.com/150"
                            alt="Your Image"
                            className="w-40 h-40 rounded-full object-cover"
                        />
                    </div>
                </div>
            </div>

            {/* About Section */}
            <div className="container mx-auto py-10" ref={aboutRef}>
                <h1 className="text-3xl font-bold mb-4">About Me</h1>
                <p>{aboutpara}</p>
                <p className="mt-4">{aboutpara2}</p>
            </div>

            {/* Experience Section */}
            <div className="container mx-auto py-10" ref={experienceRef}>
                <h1 className="text-3xl font-bold mb-4">Experience</h1>
                <div className="space-y-4">
                    {experiences.map((experience, index) => (
                        <div key={index} className="border p-4 rounded-md">
                            <h2 className="text-xl font-bold">{experience.title}</h2>
                            <h3 className="text-lg italic">{experience.position}</h3>
                            <ul className="list-disc ml-6 mt-2">
                                {experience.point1 && <li>{experience.point1}</li>}
                                {experience.point2 && <li>{experience.point2}</li>}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Projects Section */}
            <div className="container mx-auto py-10" ref={workRef}>
                <h1 className="text-3xl font-bold mb-4">Projects</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            className="border p-4 rounded-md cursor-pointer hover:bg-gray-100 transition"
                            onClick={() => window.open(project.url)}
                        >
                            <img
                                src={project.imageSrc}
                                alt={project.title}
                                className="h-40 w-full object-cover rounded"
                            />
                            <h2 className="text-xl font-bold mt-2">{project.title}</h2>
                            <p>{project.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Skills Section */}
            <div className="container mx-auto py-10" ref={skillRef}>
                <h1 className="text-3xl font-bold mb-4">Skills</h1>
                <div className="space-y-4">
                    {services.map((service, index) => (
                        <div key={index} className="border p-4 rounded-md">
                            <h2 className="text-xl font-bold">{service.title}</h2>
                            <p>{service.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
