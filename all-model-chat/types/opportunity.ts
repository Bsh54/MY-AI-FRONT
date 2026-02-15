export interface Opportunity {
  id: string;
  type: 'Bourse' | 'Concours' | 'Stage' | 'Conférence' | 'Mentorat';
  title: string;
  organization: string;
  description: string;
  fullContent: string;
  deadline: string;
  location: string;
  image: string;
  link?: string;
  status: 'Ouvert' | 'Bientôt fini' | 'Fermé';
  reward?: string;
  featured?: boolean;
}
