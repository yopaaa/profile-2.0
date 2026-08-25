import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import About from './components/About';
import WorkExp from './components/WorkExp';
import Services from './components/Services';
import Social from './components/Social';
import Footer from './components/Footer';

export default function Page() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <About />
        <WorkExp />
        <Services />
        <Social />
      </main>
      <Footer />
    </>
  );
}
