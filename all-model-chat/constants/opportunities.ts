import { Opportunity } from '../types/opportunity';

export const OPPORTUNITIES_DATA: Opportunity[] = [
  {
    id: 'hero-1',
    type: 'Bourse',
    title: 'Bourse ShadsAI - Excellence en IA Générative',
    organization: 'ShadsAI Foundation',
    description: 'Une opportunité unique de financer vos études et de rejoindre notre programme d\'incubation exclusif.',
    fullContent: 'La bourse ShadsAI est notre programme phare pour l\'année 2026. Elle a été conçue pour identifier et soutenir les esprits les plus brillants dans le domaine de l\'intelligence artificielle générative.\n\n**Objectifs du Programme :**\nL\'objectif principal est de lever les barrières financières pour les étudiants talentueux tout en leur offrant un environnement technique de pointe.\n\n**Détails de la Récompense :**\n- Une bourse d\'études de 15 000€ versée en deux fois.\n- Un accès prioritaire à nos serveurs de calcul haute performance (H100/A100).\n\n**Critères d\'Éligibilité :**\n- Être inscrit dans un cursus de Master 2 ou de Doctorat (PhD).\n- Avoir un projet de recherche lié aux LLMs.\n\n**Processus de Candidature :**\nSoumettez un dossier complet incluant un CV académique et une lettre de motivation.',
    deadline: '30 Avril 2026',
    location: 'Global / Remote',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4628c6bb5?auto=format&fit=crop&q=80&w=1200',
    link: 'https://shadsai.foundation/apply',
    status: 'Ouvert',
    reward: '15,000 €',
    featured: true
  },
  {
    id: '1',
    type: 'Concours',
    title: 'Deepfake Detection Challenge',
    organization: 'Meta AI Research',
    description: 'Créez les meilleurs algorithmes pour détecter les médias générés par IA.',
    fullContent: 'Face à la montée en puissance des outils de génération d\'images et de vidéos, la détection des contenus synthétiques est devenue un enjeu majeur pour la sécurité de l\'information.\n\n**Le Défi Technique :**\nConcevoir un modèle capable d\'identifier des manipulations extrêmement subtiles dans des flux vidéo haute définition.\n\n**Récompenses :**\nLe grand gagnant recevra une dotation financière et une proposition d\'incubation.',
    deadline: '15 Mars 2026',
    location: 'En ligne',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
    link: 'https://ai.meta.com/challenges/deepfake-detection',
    status: 'Ouvert',
    reward: 'Place en incubation'
  },
  {
    id: '2',
    type: 'Mentorat',
    title: 'Programme "Alpha Founders" IA',
    organization: 'Y Combinator (Section IA)',
    description: '8 semaines de mentorat intensif pour transformer votre idée de startup IA en réalité.',
    fullContent: 'Le programme Alpha Founders est une initiative exclusive de Y Combinator dédiée spécifiquement aux startups qui placent l\'IA au cœur de leur proposition de valeur.\n\n**Ce que vous allez bâtir :**\n- Une stratégie de Go-to-Market robuste.\n- Un modèle économique viable.\n\n**Critères :**\nNous recherchons des équipes fondatrices ayant déjà un prototype fonctionnel.',
    deadline: '05 Mars 2026',
    location: 'San Francisco / Hybrid',
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800',
    link: 'https://www.ycombinator.com/apply',
    status: 'Bientôt fini',
    reward: 'Accompagnement Expert'
  }
];
