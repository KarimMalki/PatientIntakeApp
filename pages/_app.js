import { useRouter } from 'next/router';
import { AnimatePresence, motion } from 'framer-motion';
import Header from '../components/Header';
import DentistHeader from '../components/DentistHeader';
import PatientHeader from '../components/PatientHeader';
import Footer from '../components/Footer';
import { pageTransition } from '../utils/animations';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
    const router = useRouter();
    
    // Function to determine which header to show
    const getHeaderSetup = () => {
        const path = router.pathname;
        
        // Home page has no header
        if (path === '/') {
            return null;
        }
        
        // Dentist section shows dentist header
        if (path.startsWith('/dentist')) {
            return <DentistHeader key="dentist-header" />;
        }
        
        // Patient section shows patient header
        if (path.startsWith('/patient') || path === '/patientview' || path === '/patientdashboard' || path === '/signup') {
            return <PatientHeader key="patient-header" />;
        }
        
        // Default pages get the main header
        return <Header key="main-header" />;
    };

    // Remove any existing headers from the page props
    const { header, ...restPageProps } = pageProps;

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header is outside AnimatePresence to prevent remounting */}
            {getHeaderSetup()}
            
            <AnimatePresence mode="wait">
                <motion.main
                    key={router.route}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={pageTransition}
                    className="flex-grow"
                >
                    <Component {...restPageProps} />
                </motion.main>
            </AnimatePresence>
            
            <Footer />

            {/* Add global styles for header positioning */}
            <style jsx global>{`
                header {
                    position: sticky;
                    top: 0;
                    z-index: 50;
                }
            `}</style>
        </div>
    );
}

export default MyApp;
