import portfolioData from "../../data/data.json";
import ProjectsClient from "./ProjectsClient";

export const metadata = {
  title: "Semua Proyek & Portofolio",
  description:
    "Arsip lengkap seluruh proyek pengembangan aplikasi web, IoT, dan solusi digital yang dikembangkan oleh Yopa Pitra R.",
  openGraph: {
    title: "Semua Proyek & Portofolio — Yopa Pitra R.",
    description:
      "Arsip lengkap seluruh proyek pengembangan aplikasi web, IoT, dan solusi digital yang dikembangkan oleh Yopa Pitra R.",
    url: `${portfolioData.seo.siteUrl}/projects`,
  },
  alternates: {
    canonical: `${portfolioData.seo.siteUrl}/projects`,
  },
};

export default function ProjectsPage() {
  const projects = portfolioData.projects || [];

  return <ProjectsClient projects={projects} />;
}
