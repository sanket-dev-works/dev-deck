import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getToolBySlug, tools } from '@/config/tools';
import { ToolPage } from '@/components/tools/ToolPage';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return {};
  return {
    title: `${tool.name} | DevDeck`,
    description: tool.description,
    openGraph: {
      title: `${tool.name} | DevDeck`,
      description: tool.description,
      type: 'website',
      siteName: 'DevDeck',
    },
    twitter: {
      card: 'summary',
      title: `${tool.name} | DevDeck`,
      description: tool.description,
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();
  return <ToolPage tool={tool} />;
}
