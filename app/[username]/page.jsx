import Head from 'next/head';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Marquee from '../components/Marquee';
import About from '../components/About';
import Articles from '../components/Articles';
import Services from '../components/Services';
import Social from '../components/Social';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Head>
        <title>Yopa Pitra R. — Developer & Designer</title>
      </Head>
      
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Articles />
        <Services />
        <Social />
      </main>
      <Footer />
    </>
  );
}