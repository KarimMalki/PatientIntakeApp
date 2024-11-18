export default function Welcome() {
    return (
        <section className="flex items-start justify-center flex-grow bg-blue-900 pt-10">
            <div className="text-center space-y-6">
                {/* Top Half */}
                <div className="flex justify-center space-x-2">
                    {["A", "M", "E", "R"].map((letter) => (
                        <h1 key={letter} className="text-8xl font-extrabold text-white">
                            {letter}
                        </h1>
                    ))}
                </div>

                {/* Dynamic Width Divider */}
                <div className="bg-white h-10 mx-auto flex justify-center items-center px-4 inline-block">
                    <p className="text-blue-900 font-medium tracking-wide text-sm">
                        SOFTWARE DEVELOPER • CREATIVE PROBLEM SOLVER
                    </p>
                </div>

                {/* Bottom Half */}
                <div className="flex justify-center space-x-2 mb-10">
                    {["A", "M", "M", "A", "R", "I"].map((letter) => (
                        <h1 key={letter} className="text-8xl font-extrabold text-white mb-10">
                            {letter}
                        </h1>
                    ))}
                </div>
            </div>
        </section>
    );
}
