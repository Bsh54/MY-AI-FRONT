import React, { useState } from 'react';
import {
  MessageSquare,
  Lightbulb,
  ArrowRight,
  ChevronLeft,
  Sparkles,
  Clock,
  MapPin,
  Globe,
  Star,
  Zap,
  Bell,
  CheckCircle2,
  Users
} from 'lucide-react';

// Imports des composants originaux
import { HistorySidebar } from '../sidebar/HistorySidebar';
import { ChatArea } from './ChatArea';
import { AppModals } from '../modals/AppModals';
import { SidePanel } from './SidePanel';

interface ShadsAIHubProps {
  sidebarProps: any;
  chatAreaProps: any;
  appModalsProps: any;
  isHistorySidebarOpen: boolean;
  setIsHistorySidebarOpen: (isOpen: boolean | ((prev: boolean) => boolean)) => void;
  sidePanelContent: any;
  onCloseSidePanel: () => void;
  themeId: string;
  currentTheme: any;
}

interface Opportunity {
  id: string;
  type: 'Bourse' | 'Concours' | 'Stage' | 'Conférence' | 'Mentorat';
  title: string;
  organization: string;
  description: string;
  fullContent: string;
  deadline: string;
  location: string;
  image: string;
  status: 'Ouvert' | 'Bientôt fini' | 'Fermé';
  reward?: string; // Montant ou prix
  featured?: boolean;
}

const OPPORTUNITIES_DATA: Opportunity[] = [
  {
    id: 'hero-1',
    type: 'Bourse',
    title: 'Bourse ShadsAI - Excellence en IA Générative',
    organization: 'ShadsAI Foundation',
    description: 'Une opportunité unique de financer vos études et de rejoindre notre programme d\'incubation exclusif.',
    fullContent: 'La bourse ShadsAI est notre programme phare. Elle ne se limite pas à un soutien financier, mais offre un accès direct à nos outils premium et à un réseau d\'experts en IA de renommée mondiale.\n\n**Contexte du programme :**\nFace à l\'évolution rapide des modèles de langage et de la vision par ordinateur, nous croyons qu\'il est crucial de soutenir les talents qui façonneront l\'éthique et la performance de l\'IA de demain. Ce programme s\'adresse aux esprits curieux, prêts à repousser les limites de ce que nous pensions possible avec les algorithmes.\n\n**Avantages détaillés :**\n- Financement total des frais de scolarité (jusqu\'à 15 000€ versés en deux tranches).\n- Accès illimité aux clusters de GPU ShadsAI pour vos projets personnels ou académiques.\n- Mentorat mensuel par des ingénieurs de Google Deepmind et OpenAI.\n- Invitation VIP à la ShadsAI DevCon 2026 à Singapour.\n\n**Éligibilité et Critères :**\n- Être actuellement inscrit en Master 2 ou en doctorat dans une discipline STEM.\n- Présenter un projet de recherche ou une application innovante utilisant les LLMs.\n- Maîtrise avancée de Python et des frameworks de deep learning (PyTorch/TensorFlow).\n- Ouvert à toutes les nationalités, sans distinction géographique.\n\n**Processus de sélection :**\nLe processus se déroule en trois étapes clés. Tout d\'abord, une revue technique de votre dossier par notre comité scientifique. Ensuite, les candidats présélectionnés seront invités à un entretien technique de 45 minutes pour discuter de leur vision et de leurs compétences. Enfin, une session de pitch final devant les fondateurs de ShadsAI déterminera les lauréats.\n\n**Calendrier :**\n- Ouverture des candidatures : 1er Février 2026\n- Clôture : 30 Avril 2026\n- Annonce des résultats : 15 Juin 2026\n- Début du programme : Septembre 2026.',
    deadline: '30 Avril 2026',
    location: 'Global / Remote',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4628c6bb5?auto=format&fit=crop&q=80&w=1200',
    status: 'Ouvert',
    reward: '15,000 €',
    featured: true
  },
  {
    id: '1',
    type: 'Concours',
    title: 'Deepfake Detection Challenge',
    organization: 'Meta AI Research',
    description: 'Créez les meilleurs algorithmes pour détecter les médias générés par IA et gagnez une place en incubation.',
    fullContent: 'Un défi technique majeur pour la sécurité de l\'information mondiale. Avec la prolifération des contenus synthétiques, la capacité à distinguer le vrai du faux est devenue un enjeu de souveraineté numérique.\n\n**Objectif du challenge :**\nLes participants devront développer un modèle capable de détecter des manipulations subtiles dans des flux vidéo haute définition, même après compression ou application de filtres. Un dataset exclusif de 10 To sera mis à disposition des équipes sélectionnées.\n\n**Contraintes techniques :**\n- Les modèles doivent être capables de traiter une vidéo de 10 secondes en moins de 1 seconde sur un GPU standard.\n- L\'utilisation de techniques de "Explainable AI" (XAI) est fortement encouragée pour justifier les décisions du modèle.\n- Les soumissions doivent inclure le code complet et les poids du modèle pré-entraîné.\n\n**Prix et Distinctions :**\n- Le grand gagnant recevra une subvention de recherche de 50 000$.\n- Accès au programme d\'incubation Meta AI Lab pendant 6 mois avec mise à disposition de ressources computationnelles massives.\n- Publication conjointe des résultats dans une revue académique majeure et présentation lors de la conférence CVPR 2026.\n\n**Éthique et Confidentialité :**\nMeta s\'engage à ce que tous les algorithmes développés dans le cadre de ce challenge restent la propriété intellectuelle de leurs créateurs, tout en accordant une licence d\'utilisation non exclusive pour la recherche en sécurité.',
    deadline: '15 Mars 2026',
    location: 'En ligne',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
    status: 'Ouvert',
    reward: 'Place en incubation'
  },
  {
    id: '2',
    type: 'Mentorat',
    title: 'Programme "Alpha Founders" IA',
    organization: 'Y Combinator (Section IA)',
    description: '8 semaines de mentorat intensif pour transformer votre idée de startup IA en réalité.',
    fullContent: 'Bénéficiez du réseau le plus puissant de la Silicon Valley pour propulser votre startup IA au niveau supérieur. Ce programme intensif est conçu pour les fondateurs techniques qui souhaitent passer d\'un prototype à une entreprise viable.\n\n**Ce que vous apprendrez :**\n- Product-Market Fit pour les solutions IA : comment identifier un problème réel que l\'IA peut résoudre de manière unique.\n- Stratégies de levée de fonds en Seed et Série A avec des investisseurs spécialisés en deep tech.\n- Recrutement des meilleurs ingénieurs Machine Learning et structuration d\'une équipe technique.\n- Gestion de l\'infrastructure cloud à grande échelle et optimisation des coûts d\'inférence.\n\n**Format du programme :**\nLe programme combine des sessions de groupe hebdomadaires, des dîners avec des fondateurs à succès (Airbnb, Stripe, Cruise) et des "office hours" individuelles avec des partenaires de YC. L\'accent est mis sur l\'exécution rapide et la validation client.\n\n**Critères d\'admission :**\nNous recherchons des équipes (de préférence 2-3 co-fondateurs) ayant déjà un MVP technique. Vous devez être prêt à vous consacrer à 100% à votre projet durant les 8 semaines. Le programme se termine par le célèbre "Demo Day" devant un panel de 500 investisseurs.',
    deadline: '05 Mars 2026',
    location: 'San Francisco / Hybrid',
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800',
    status: 'Bientôt fini',
    reward: 'Accompagnement Expert'
  },
  {
    id: '3',
    type: 'Conférence',
    title: 'Summit IA & Éthique 2026',
    organization: 'UNESCO Tech',
    description: 'Rejoignez les leaders d\'opinion pour définir le futur de la régulation de l\'IA.',
    fullContent: 'Le Summit IA & Éthique 2026 est la plus grande plateforme de dialogue entre la communauté scientifique et les régulateurs mondiaux. Dans un contexte où l\'AGI (Artificial General Intelligence) devient une possibilité concrète, définir des garde-fous est une priorité absolue.\n\n**Points forts de l\'édition :**\n- Keynotes par les pionniers du domaine sur les risques existentiels et les opportunités de progrès humain.\n- Tables rondes sur l\'IA dans l\'éducation et la santé dans les pays en développement.\n- Ateliers pratiques sur l\'implémentation de la charte de l\'UNESCO pour une IA responsable.\n\n**Public visé :**\nChercheurs en philosophie, ingénieurs en IA, juristes spécialisés en tech, et représentants de la société civile. L\'objectif est de produire un livre blanc qui servira de base aux prochaines réglementations internationales.\n\n**Logistique :**\nL\'événement se déroule au Palais des Nations à Genève. Pour les participants sélectionnés, l\'UNESCO prend en charge l\'intégralité des frais (voyage, hébergement, restauration). Un système de streaming interactif est également prévu pour ceux qui ne peuvent pas se déplacer.',
    deadline: '20 Mai 2026',
    location: 'Genève, Suisse',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=800',
    status: 'Ouvert',
    reward: 'Prise en charge totale'
  },
  {
    id: '4',
    type: 'Stage',
    title: 'Stage Ingénieur NLP (LLM Optimization)',
    organization: 'Mistral AI',
    description: 'Travaillez sur l\'optimisation de modèles de pointe au cœur de l\'écosystème européen.',
    fullContent: 'Mistral AI, leader européen de l\'IA générative, propose un stage de fin d\'études exceptionnel au sein de son équipe R&D à Paris. Vous participerez au développement de la prochaine génération de modèles ouverts.\n\n**VOS MISSIONS :**\n1. Recherche et implémentation de nouvelles méthodes de compression de modèles (Quantization, Pruning, Distillation).\n2. Optimisation des kernels CUDA pour accélérer l\'inférence sur différentes architectures matérielles.\n3. Participation à l\'entraînement de modèles à grande échelle sur des clusters de milliers de GPU.\n4. Contribution à la librairie open-source de Mistral pour permettre à la communauté d\'utiliser nos modèles plus efficacement.\n\n**VOTRE PROFIL :**\n- Étudiant en dernière année d\'école d\'ingénieur ou Master 2 avec une spécialisation en ML/IA.\n- Maîtrise parfaite de Python et expérience approfondie avec PyTorch.\n- Connaissance des architectures Transformer et des mécanismes d\'attention.\n- Esprit d\'équipe, autonomie et forte capacité d\'apprentissage.\n\n**ENVIRONNEMENT :**\nVous travaillerez dans un environnement stimulant aux côtés des meilleurs experts mondiaux du domaine. Nous offrons une rémunération attractive, des bureaux en plein cœur de Paris et la possibilité d\'une embauche en CDI à l\'issue du stage.',
    deadline: '10 Avril 2026',
    location: 'Paris, France',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
    status: 'Ouvert',
    reward: '2,500 € / mois'
  }
];

const ShadsAIHub: React.FC<ShadsAIHubProps> = (props) => {
  const {
    sidebarProps,
    chatAreaProps,
    appModalsProps,
    isHistorySidebarOpen,
    setIsHistorySidebarOpen,
    sidePanelContent,
    onCloseSidePanel,
    themeId,
  } = props;

  const [activeTab, setActiveTab] = useState<'chat' | 'opportunities'>('opportunities');
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [filterType, setFilterType] = useState<string>('Tous');

  const otherOpps = OPPORTUNITIES_DATA.filter(o => filterType === 'Tous' || o.type === filterType);

  return (
    <div className={`flex flex-col h-full w-full overflow-hidden bg-[var(--theme-bg-primary)] text-[var(--theme-text-primary)] transition-colors duration-300`}>

      {/* HEADER NAV */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-[var(--theme-border-primary)] bg-[var(--theme-bg-secondary)] z-[100] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[var(--theme-bg-accent)] rounded-xl flex items-center justify-center shadow-lg shadow-[var(--theme-bg-accent)]/20">
            <Sparkles className="w-5 h-5 text-[var(--theme-text-accent)]" />
          </div>
          <span className="font-black text-lg tracking-tighter uppercase">ShadsAI Hub</span>
        </div>

        <nav className="flex bg-[var(--theme-bg-tertiary)] rounded-2xl p-1 border border-[var(--theme-border-primary)]">
          <button
            onClick={() => setActiveTab('opportunities')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
              activeTab === 'opportunities'
              ? 'bg-[var(--theme-bg-accent)] text-[var(--theme-text-accent)] shadow-xl'
              : 'text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)]'
            }`}
          >
            <Lightbulb className="w-4 h-4" />
            EXPLORER
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
              activeTab === 'chat'
              ? 'bg-[var(--theme-bg-accent)] text-[var(--theme-text-accent)] shadow-xl'
              : 'text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)]'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            ASSISTANT
          </button>
        </nav>

        <div className="hidden md:flex items-center gap-4">
           <button className="p-2 text-[var(--theme-text-secondary)] hover:text-[var(--theme-bg-accent)] transition-colors">
              <Bell className="w-5 h-5" />
           </button>
           <div className="w-10 h-10 rounded-full bg-[var(--theme-bg-tertiary)] border border-[var(--theme-border-secondary)]"></div>
        </div>
      </header>

      <div className="flex-1 relative overflow-hidden">

        {/* --- CHAT SECTION --- */}
        <div className={`absolute inset-0 flex transition-all duration-700 ${activeTab === 'chat' ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-95 z-0 pointer-events-none'}`}>
          {isHistorySidebarOpen && <div onClick={() => setIsHistorySidebarOpen(false)} className="fixed inset-0 bg-black/60 z-40 md:hidden" />}
          <HistorySidebar {...sidebarProps} />
          <ChatArea {...chatAreaProps} />
          {sidePanelContent && <SidePanel content={sidePanelContent} onClose={onCloseSidePanel} themeId={themeId} />}
          <AppModals {...appModalsProps} />
        </div>

        {/* --- OPPORTUNITIES SECTION --- */}
        <div className={`absolute inset-0 overflow-y-auto bg-[var(--theme-bg-primary)] transition-all duration-700 ${activeTab === 'opportunities' ? 'opacity-100 scale-100 z-20' : 'opacity-0 scale-105 z-0 pointer-events-none'}`}>
          <div className="max-w-7xl mx-auto p-6 md:p-12 space-y-12">
            {!selectedOpp ? (
              <>
                {/* FILTRES & TITRE */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-[var(--theme-border-primary)] pb-8">
                  <div className="space-y-4">
                    <h3 className="text-3xl font-black flex items-center gap-4">
                       OPPORTUNITIES BOARD
                       <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-2 p-1.5 bg-[var(--theme-bg-secondary)] rounded-2xl border border-[var(--theme-border-primary)] shadow-sm">
                    {['Tous', 'Bourse', 'Concours', 'Stage', 'Mentorat', 'Conférence'].map(t => (
                      <button
                        key={t}
                        onClick={() => setFilterType(t)}
                        className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                          filterType === t
                          ? 'bg-[var(--theme-bg-accent)] text-[var(--theme-text-accent)] shadow-lg'
                          : 'text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)]'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* GRILLE DYNAMIQUE */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {otherOpps.map(opp => (
                    <div
                      key={opp.id}
                      onClick={() => setSelectedOpp(opp)}
                      className="group flex flex-col bg-[var(--theme-bg-secondary)] border border-[var(--theme-border-secondary)] rounded-[2.5rem] overflow-hidden cursor-pointer hover:border-[var(--theme-bg-accent)]/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                    >
                      <div className="h-64 relative overflow-hidden">
                        <img src={opp.image} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--theme-bg-secondary)] via-transparent to-transparent opacity-40"></div>
                        <div className="absolute top-6 left-6 flex flex-col gap-2">
                           <span className="bg-black/50 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/20">
                             {opp.type}
                           </span>
                           {opp.reward && (
                             <span className="bg-[var(--theme-bg-accent)] text-[var(--theme-text-accent)] px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg">
                               {opp.reward}
                             </span>
                           )}
                        </div>
                      </div>

                      <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
                        <div className="space-y-4">
                          <p className="text-[var(--theme-bg-accent)] text-[10px] font-black uppercase tracking-[0.2em]">{opp.organization}</p>
                          <h4 className="text-2xl font-bold leading-tight group-hover:text-[var(--theme-text-link)] transition-colors line-clamp-2">
                             {opp.title}
                          </h4>
                          <p className="text-[var(--theme-text-secondary)] text-sm leading-relaxed line-clamp-3 italic">
                             "{opp.description}"
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-6 border-t border-[var(--theme-border-primary)]">
                          <div className="flex items-center gap-2 text-[var(--theme-text-tertiary)] text-xs font-bold uppercase">
                            <Clock className="w-4 h-4" />
                            {opp.deadline}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              /* VUE DÉTAILLÉE IMMERSIVE (UTILISE TOUTE LA PAGE) */
              <div className="animate-in slide-in-from-right duration-700 pb-20">
                {/* HEADER IMAGE PLEIN LARGE (SANS DEGRADE) */}
                <div className="relative h-[40vh] md:h-[55vh] w-full overflow-hidden rounded-b-[3rem] shadow-xl">
                  <img src={selectedOpp.image} className="w-full h-full object-cover" alt={selectedOpp.title} />

                  {/* BOUTON RETOUR FLOTTANT TOUJOURS SUR L'IMAGE */}
                  <div className="absolute top-8 left-8 md:left-12">
                    <button
                      onClick={() => setSelectedOpp(null)}
                      className="group flex items-center gap-3 bg-black/40 backdrop-blur-xl border border-white/10 px-5 py-2.5 rounded-2xl text-white hover:bg-[var(--theme-bg-accent)] transition-all font-bold uppercase text-[10px] tracking-[0.2em] shadow-2xl"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      RETOUR
                    </button>
                  </div>
                </div>

                {/* TITRE ET BADGE DÉPLACÉS EN DESSOUS POUR LA CLARTÉ */}
                <div className="max-w-7xl mx-auto px-8 md:px-12 mt-10 space-y-4">
                  <span className="bg-[var(--theme-bg-accent)] text-white px-5 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest inline-block shadow-lg">
                    {selectedOpp.type}
                  </span>
                  <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tighter text-[var(--theme-text-primary)]">
                    {selectedOpp.title}
                  </h1>
                </div>

                {/* CONTENU EN GRILLE LARGE */}
                <div className="max-w-7xl mx-auto px-8 md:px-12 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-16">
                  <div className="lg:col-span-2 space-y-10">
                    <div className="prose prose-invert text-[var(--theme-text-secondary)] text-xl leading-relaxed max-w-none">
                      <div className="space-y-8 text-lg font-medium opacity-90">
                        {selectedOpp.fullContent.split('\n').map((line, i) => (
                          <p key={i}>{line}</p>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* BARRE LATÉRALE D'ACTIONS - POSITIONNEMENT ÉQUILIBRÉ AU SCROLL */}
                  <div className="space-y-6">
                    <div className="sticky top-[25vh] space-y-4">
                      <button className="w-full bg-[var(--theme-bg-accent)] hover:bg-[var(--theme-bg-accent-hover)] text-[var(--theme-text-accent)] font-black py-5 rounded-2xl shadow-xl shadow-[var(--theme-bg-accent)]/20 transition-all flex items-center justify-center gap-3 group active:scale-[0.98] text-base uppercase tracking-tighter">
                        POSTULER MAINTENANT
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                      </button>

                      <button
                        onClick={() => {
                          const message = `Je suis intéressé par l'opportunité "${selectedOpp.title}" de ${selectedOpp.organization}. Peux-tu m'aider à préparer mon dossier de candidature et me donner des conseils pour réussir ?`;
                          if (chatAreaProps.onSendMessage) {
                            chatAreaProps.onSendMessage(message);
                            setActiveTab('chat');
                          }
                        }}
                        className="w-full bg-[var(--theme-bg-secondary)] border border-[var(--theme-border-secondary)] text-[var(--theme-text-primary)] font-black py-5 rounded-2xl hover:bg-[var(--theme-bg-tertiary)] transition-all flex items-center justify-center gap-3 group text-base uppercase tracking-tighter shadow-md"
                      >
                        PRÉPARER AVEC L'IA
                        <Sparkles className="w-5 h-5 text-[var(--theme-bg-accent)] group-hover:animate-pulse" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShadsAIHub;
