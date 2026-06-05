import { notFound } from "next/navigation";
import { services } from "@/lib/data";
import ServiceDetailClient from "@/components/ServiceDetailClient";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export function generateMetadata({ params }) {
  const service = services.find((item) => item.slug === params.slug);
  return {
    title: service ? `${service.title} | Zee Brows` : "Service | Zee Brows",
    description: service?.description
  };
}

export default function ServiceDetail({ params }) {
  const service = services.find((item) => item.slug === params.slug);
  if (!service) notFound();

  return <ServiceDetailClient slug={params.slug} />;
}
