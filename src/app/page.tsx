import { LandingPage } from '@/components/landing-page';

export const metadata = {
  title: 'Tambo Email - AI Email Assistant with Generative UI',
  description:
    'Talk in natural language. Watch AI render the perfect UI—charts, cards, previews, and action buttons. Your AI email assistant.',
  openGraph: {
    title: 'Tambo Email - AI Email Assistant',
    description: 'AI-powered email assistant with generative UI components.',
    type: 'website',
  },
};

export default function Page() {
  return <LandingPage />;
}
