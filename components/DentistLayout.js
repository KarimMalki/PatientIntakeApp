export default function DentistLayout({ children }) {
    return (
        <div className="min-h-screen relative bg-gradient-to-br from-gray-100 to-gray-50">
            {/* Stacked Wave Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Bottom Wave */}
                <svg className="absolute bottom-0 w-full h-screen" viewBox="0 0 1440 1024" preserveAspectRatio="none">
                    <path 
                        fill="rgba(209, 213, 219, 0.3)" 
                        d="M0,896L48,880C96,864,192,832,288,789.3C384,747,480,693,576,693.3C672,693,768,747,864,757.3C960,768,1056,736,1152,709.3C1248,683,1344,661,1392,650.7L1440,640L1440,1024L1392,1024C1344,1024,1248,1024,1152,1024C1056,1024,960,1024,864,1024C768,1024,672,1024,576,1024C480,1024,384,1024,288,1024C192,1024,96,1024,48,1024L0,1024Z"
                    />
                </svg>
                {/* Middle Wave */}
                <svg className="absolute bottom-0 w-full h-screen" viewBox="0 0 1440 1024" preserveAspectRatio="none">
                    <path 
                        fill="rgba(156, 163, 175, 0.2)" 
                        d="M0,512L48,522.7C96,533,192,555,288,544C384,533,480,491,576,465.3C672,440,768,432,864,465.3C960,499,1056,573,1152,592C1248,611,1344,573,1392,554.7L1440,536L1440,1024L1392,1024C1344,1024,1248,1024,1152,1024C1056,1024,960,1024,864,1024C768,1024,672,1024,576,1024C480,1024,384,1024,288,1024C192,1024,96,1024,48,1024L0,1024Z"
                    />
                </svg>
                {/* Upper Middle Wave */}
                <svg className="absolute bottom-0 w-full h-screen" viewBox="0 0 1440 1024" preserveAspectRatio="none">
                    <path 
                        fill="rgba(209, 213, 219, 0.15)" 
                        d="M0,256L48,261.3C96,267,192,277,288,272C384,267,480,245,576,234.7C672,224,768,224,864,229.3C960,235,1056,245,1152,240C1248,235,1344,213,1392,202.7L1440,192L1440,1024L1392,1024C1344,1024,1248,1024,1152,1024C1056,1024,960,1024,864,1024C768,1024,672,1024,576,1024C480,1024,384,1024,288,1024C192,1024,96,1024,48,1024L0,1024Z"
                    />
                </svg>
                {/* Top Wave */}
                <svg className="absolute bottom-0 w-full h-screen" viewBox="0 0 1440 1024" preserveAspectRatio="none">
                    <path 
                        fill="rgba(156, 163, 175, 0.1)" 
                        d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,80C672,64,768,64,864,80C960,96,1056,128,1152,144C1248,160,1344,160,1392,160L1440,160L1440,1024L1392,1024C1344,1024,1248,1024,1152,1024C1056,1024,960,1024,864,1024C768,1024,672,1024,576,1024C480,1024,384,1024,288,1024C192,1024,96,1024,48,1024L0,1024Z"
                    />
                </svg>
                {/* Very Top Wave */}
                <svg className="absolute bottom-0 w-full h-screen" viewBox="0 0 1440 1024" preserveAspectRatio="none">
                    <path 
                        fill="rgba(209, 213, 219, 0.08)" 
                        d="M0,0L48,21.3C96,43,192,85,288,90.7C384,96,480,64,576,48C672,32,768,32,864,37.3C960,43,1056,53,1152,58.7C1248,64,1344,64,1392,64L1440,64L1440,1024L1392,1024C1344,1024,1248,1024,1152,1024C1056,1024,960,1024,864,1024C768,1024,672,1024,576,1024C480,1024,384,1024,288,1024C192,1024,96,1024,48,1024L0,1024Z"
                    />
                </svg>
            </div>

            <div className="p-6">
                <div className="max-w-7xl mx-auto space-y-8 relative">
                    {children}
                </div>
            </div>
        </div>
    );
} 