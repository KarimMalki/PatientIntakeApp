export default function Home() {
    return (
        <section className="relative flex items-start justify-center flex-grow bg-blue-900 pt-10 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                {["+", "-", "÷", "×", "=", "∑", "∫", "π", "∞"].map((symbol, index) => (
                    <span
                        key={index}
                        className={`absolute text-white text-5xl font-bold animate-bounce`}
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${3 + Math.random() * 2}s`,
                        }}
                    >
                        {symbol}
                    </span>
                ))}
            </div>

            {/* Content */}
            <div className="text-center space-y-6 z-10">
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
