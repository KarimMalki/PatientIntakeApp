// pages/_app.js
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/globals.css'; // Import global styles

function MyApp({ Component, pageProps }) {
    return (
        <>
            <Header />
            <main>
                <Component {...pageProps} />
            </main>
            <Footer />
        </>
    );
}

export default MyApp;
