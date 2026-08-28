import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import About from './components/About';
import WorkExp from './components/WorkExp';
import Services from './components/Services';
import Social from './components/Social';
import Footer from './components/Footer';
import portfolioData from '../data/data.json';

export default function Page() {
  const { personal, seo, about, experiences, projects, socials } = portfolioData;

  // JSON-LD Structured Data Schema for Google & search crawlers (Server-Side Rendered)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${seo.siteUrl}/#person`,
        "name": personal.name,
        "alternateName": personal.shortName,
        "jobTitle": personal.role,
        "description": personal.bio,
        "url": seo.siteUrl,
        "image": `${seo.siteUrl}${seo.ogImage}`,
        "email": personal.email,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Bangka",
          "addressCountry": "ID"
        },
        "sameAs": socials.map((s) => s.url).filter((url) => url !== "#"),
        "knowsAbout": about.skills
      },
      {
        "@type": "WebSite",
        "@id": `${seo.siteUrl}/#website`,
        "url": seo.siteUrl,
        "name": `${personal.name} — Portfolio`,
        "description": seo.description,
        "publisher": {
          "@id": `${seo.siteUrl}/#person`
        }
      },
      {
        "@type": "ProfilePage",
        "@id": `${seo.siteUrl}/#webpage`,
        "url": seo.siteUrl,
        "name": seo.title,
        "description": seo.description,
        "mainEntity": {
          "@id": `${seo.siteUrl}/#person`
        }
      }
    ]
  };

  return (
    <>
      {/* Server Rendered JSON-LD Structured Data for Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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
