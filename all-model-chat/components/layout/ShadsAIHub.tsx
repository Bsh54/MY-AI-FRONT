import React, { useState } from 'react';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  MessageSquare,
  Lightbulb,
  ArrowRight,
  ChevronLeft,
  Sparkles,
  Clock,
  Plus
} from 'lucide-react';

// Imports des composants originaux
import { HistorySidebar } from '../sidebar/HistorySidebar';
import { ChatArea } from './ChatArea';
import { AppModals } from '../modals/AppModals';
import { SidePanel } from './SidePanel';
import { AddOpportunityForm } from './AddOpportunityForm';

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
  link?: string;
  status: 'Ouvert' | 'Bientôt fini' | 'Fermé';
  reward?: string;
  featured?: boolean;
}

const OPPORTUNITIES_DATA: Opportunity[] = [
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
    status: 'Bientôt fini',
    reward: 'Accompagnement Expert'
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
  const [opportunities, setOpportunities] = useState<Opportunity[]>(OPPORTUNITIES_DATA);
  const [isAdding, setIsAdding] = useState(false);

  const otherOpps = opportunities.filter(o => filterType === 'Tous' || o.type === filterType);

  return (
    <div className={`flex flex-col h-full w-full overflow-hidden bg-[var(--theme-bg-primary)] text-[var(--theme-text-primary)] transition-colors duration-300 relative`}>

      {/* MOBILE HEADER */}
      <header className="flex md:hidden items-center justify-between px-4 py-3 border-b border-[var(--theme-border-primary)] bg-[var(--theme-bg-secondary)] z-[100]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[var(--theme-bg-accent)]" />
          <span className="font-black text-sm uppercase tracking-tighter">ShadsAI</span>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-[var(--theme-bg-accent)] text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest"
        >
          <Plus className="w-3 h-3 inline mr-1" /> AJOUTER
        </button>
      </header>

      {/* HEADER DESKTOP */}
      <header className="hidden md:flex items-center justify-between px-6 py-3 border-b border-[var(--theme-border-primary)] bg-[var(--theme-bg-secondary)] z-[100] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[var(--theme-bg-accent)] rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-[var(--theme-text-accent)]" />
          </div>
          <span className="font-black text-lg tracking-tighter uppercase">ShadsAI Hub</span>
        </div>

        <nav className="flex bg-[var(--theme-bg-tertiary)] rounded-2xl p-1 border border-[var(--theme-border-primary)]">
          <button
            onClick={() => setActiveTab('opportunities')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'opportunities' ? 'bg-[var(--theme-bg-accent)] text-[var(--theme-text-accent)] shadow-xl' : 'text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)]'}`}
          >
            <Lightbulb className="w-4 h-4" /> EXPLORER
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'chat' ? 'bg-[var(--theme-bg-accent)] text-[var(--theme-text-accent)] shadow-xl' : 'text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)]'}`}
          >
            <MessageSquare className="w-4 h-4" /> ASSISTANT
          </button>
        </nav>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-[var(--theme-bg-accent)] text-white px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg active:scale-95"
          >
            <Plus className="w-4 h-4" /> AJOUTER
          </button>
          <div className="w-8 h-8 rounded-full bg-[var(--theme-bg-tertiary)] border border-[var(--theme-border-primary)] overflow-hidden">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      <div className="flex-1 relative overflow-hidden">
        {/* Formulaire d'ajout (Overlay) */}
        {isAdding && (
          <div className="absolute inset-0 z-[300] bg-[var(--theme-bg-primary)]">
            <AddOpportunityForm
              onClose={() => setIsAdding(false)}
              onAdd={(newOpp) => {
                setOpportunities([newOpp, ...opportunities]);
                setIsAdding(false);
              }}
            />
          </div>
        )}

        {/* Contenu principal */}
        <div className={`absolute inset-0 flex pb-16 md:pb-0 ${activeTab === 'chat' ? 'flex z-10' : 'hidden'}`}>
          {isHistorySidebarOpen && <div onClick={() => setIsHistorySidebarOpen(false)} className="fixed inset-0 bg-black/60 z-40 md:hidden" />}
          <HistorySidebar {...sidebarProps} />
          <div className="flex-1 flex flex-col min-w-0 h-full relative">
            <ChatArea {...chatAreaProps} />
          </div>
          {sidePanelContent && <SidePanel content={sidePanelContent} onClose={onCloseSidePanel} themeId={themeId} />}
          <AppModals {...appModalsProps} />
        </div>

        <div className={`absolute inset-0 overflow-y-auto bg-[var(--theme-bg-primary)] pb-16 md:pb-0 ${activeTab === 'opportunities' ? 'block z-20' : 'hidden'}`}>
          <div className="max-w-7xl mx-auto p-6 md:p-12 space-y-12">
            {!selectedOpp ? (
              <>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-[var(--theme-border-primary)] pb-8">
                  <h3 className="text-3xl font-black uppercase tracking-tight text-[var(--theme-text-primary)]">Opportunities Board</h3>
                  <div className="flex flex-wrap gap-2 p-1.5 bg-[var(--theme-bg-secondary)] rounded-2xl border border-[var(--theme-border-primary)]">
                    {['Tous', 'Bourse', 'Concours', 'Stage', 'Mentorat', 'Conférence'].map(t => (
                      <button key={t} onClick={() => setFilterType(t)} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${filterType === t ? 'bg-[var(--theme-bg-accent)] text-[var(--theme-text-accent)] shadow-lg' : 'text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)]'}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {otherOpps.map(opp => (
                    <div key={opp.id} onClick={() => setSelectedOpp(opp)} className="group flex flex-col bg-[var(--theme-bg-secondary)] border border-[var(--theme-border-secondary)] rounded-[2.5rem] overflow-hidden cursor-pointer hover:border-[var(--theme-bg-accent)]/40 transition-all duration-500">
                      <div className="h-64 relative overflow-hidden">
                        <img src={opp.image} className="w-full h-full object-cover transition-transform duration-700 scale-100 group-hover:scale-110" />
                        <div className="absolute top-6 left-6 flex flex-col gap-2">
                           <span className="bg-black/50 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/20">{opp.type}</span>
                        </div>
                      </div>
                      <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
                        <div className="space-y-4">
                          <p className="text-[var(--theme-bg-accent)] text-[10px] font-black uppercase tracking-[0.2em]">{opp.organization}</p>
                          <h4 className="text-2xl font-bold leading-tight group-hover:text-[var(--theme-text-link)] transition-colors line-clamp-2">{opp.title}</h4>
                        </div>
                        <div className="flex items-center justify-between pt-6 border-t border-[var(--theme-border-primary)]">
                          <div className="flex items-center gap-2 text-[var(--theme-text-tertiary)] text-xs font-bold uppercase"><Clock className="w-4 h-4" />{opp.deadline}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="animate-in slide-in-from-right duration-700 pb-20">
                <div className="relative h-[45vh] md:h-[65vh] w-full overflow-hidden rounded-b-[4rem] shadow-2xl">
                  <img src={selectedOpp.image} className="w-full h-full object-cover scale-105" />
                  {/* Overlay dégradé pour la profondeur */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>
                  <div className="absolute top-8 left-8">
                    <button onClick={() => setSelectedOpp(null)} className="group flex items-center gap-3 bg-black/40 backdrop-blur-xl border border-white/10 px-5 py-2.5 rounded-2xl text-white hover:bg-[var(--theme-bg-accent)] transition-all font-bold uppercase text-[10px] tracking-[0.2em]">
                      <ChevronLeft className="w-4 h-4" /> RETOUR
                    </button>
                  </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-16 relative">
                  <div className="lg:col-span-2 space-y-12">
                    <div className="space-y-6">
                      <span className="bg-[var(--theme-bg-accent)] text-white px-4 py-1 rounded-full font-black text-[9px] uppercase tracking-widest inline-block shadow-lg">{selectedOpp.type}</span>
                      <h1 className="text-2xl md:text-6xl font-black tracking-tighter text-[var(--theme-text-primary)] leading-tight">{selectedOpp.title}</h1>
                    </div>
                    <div className="text-[var(--theme-text-secondary)] max-w-none">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          h1: ({node, ...props}) => <h1 className="text-4xl font-black text-[var(--theme-text-primary)] mb-8 mt-12 tracking-tighter uppercase border-b-4 border-[var(--theme-bg-accent)] w-fit pb-2" {...props} />,
                          h2: ({node, ...props}) => <h2 className="text-2xl font-black text-[var(--theme-text-primary)] mb-6 mt-10 tracking-tight uppercase flex items-center gap-3 before:content-[''] before:w-2 before:h-8 before:bg-[var(--theme-bg-accent)] before:rounded-full" {...props} />,
                          strong: ({node, ...props}) => <strong className="text-[var(--theme-bg-accent)] font-black px-1.5 py-0.5 bg-[var(--theme-bg-accent)]/10 rounded-md" {...props} />,
                          ul: ({node, ...props}) => <ul className="space-y-4 mb-8 ml-4" {...props} />,
                          li: ({node, ...props}) => (
                            <li className="flex items-start gap-3 text-lg md:text-xl">
                              <span className="mt-2.5 w-2 h-2 rounded-full bg-[var(--theme-bg-accent)] shrink-0" />
                              <span {...props} />
                            </li>
                          ),
                          p: ({node, ...props}) => <p className="text-lg md:text-xl leading-relaxed mb-6 opacity-90 font-medium" {...props} />,
                          blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-[var(--theme-border-primary)] pl-6 italic my-8 text-2xl font-light opacity-80" {...props} />,
                        }}
                      >
                        {selectedOpp.fullContent}
                      </ReactMarkdown>
                    </div>
                  </div>

                  <div className="lg:col-span-1">
                    {/* PC: Reste centré et fixe au scroll dans sa colonne | Mobile: Suit le flux du texte */}
                    <div className="lg:sticky lg:top-[35vh] space-y-4 w-full max-w-sm mx-auto lg:ml-auto mt-12 lg:mt-0">
                      <button
                        onClick={() => {
                          if (selectedOpp.link) {
                            window.open(selectedOpp.link, '_blank');
                          }
                        }}
                        className="w-full bg-[var(--theme-bg-accent)] hover:bg-[var(--theme-bg-accent-hover)] text-[var(--theme-text-accent)] font-black py-3 md:py-5 rounded-xl md:rounded-[2rem] shadow-xl transition-all flex items-center justify-center gap-3 group active:scale-95 text-sm md:text-lg uppercase tracking-tight"
                      >
                        POSTULER MAINTENANT <ArrowRight className="w-5 h-5 md:w-6 h-6 group-hover:translate-x-2 transition-transform" />
                      </button>
                      <button
                        onClick={() => {
                          const detailedPrompt = `Bonjour ! Je souhaite postuler à l'opportunité suivante :

📌 **TITRE** : ${selectedOpp.title}
🏢 **ORGANISATION** : ${selectedOpp.organization}
📅 **DATE LIMITE** : ${selectedOpp.deadline}

**DÉTAILS DE L'ANNONCE :**
${selectedOpp.fullContent}

Peux-tu m'aider à préparer ma candidature (CV, lettre de motivation, conseils pour l'entretien) spécifiquement pour cette offre ?`;

                          if (chatAreaProps.onSendMessage) {
                            // On déclenche un nouveau chat via les props si disponible
                            if (chatAreaProps.onNewChat) chatAreaProps.onNewChat();
                            chatAreaProps.onSendMessage(detailedPrompt);
                            setActiveTab('chat');
                          }
                        }}
                        className="w-full bg-transparent border-2 border-[var(--theme-border-secondary)] text-[var(--theme-text-primary)] font-black py-3 md:py-5 rounded-xl md:rounded-[2rem] hover:bg-[var(--theme-bg-accent)] hover:border-[var(--theme-bg-accent)] hover:text-white transition-all flex items-center justify-center gap-3 group text-sm md:text-lg uppercase tracking-tight"
                      >
                        PRÉPARER AVEC L'IA <Sparkles className="w-5 h-5 md:w-6 h-6 text-[var(--theme-bg-accent)] group-hover:text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE APP BAR - STYLE CLAIR ET ICÔNES NOIRES (CHARTE GRAPHIQUE) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 z-[999] grid grid-cols-2 items-center shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        <button
          onClick={() => setActiveTab('opportunities')}
          className={`h-full flex flex-col items-center justify-center transition-all active:scale-95 relative ${activeTab === 'opportunities' ? 'text-black' : 'text-black/40'}`}
        >
          <Lightbulb className="w-6 h-6" />
          <span className="text-[10px] font-black mt-1 uppercase tracking-wider">Explorer</span>
          {activeTab === 'opportunities' && <div className="absolute bottom-1 w-12 h-0.5 bg-black rounded-full" />}
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`h-full flex flex-col items-center justify-center transition-all active:scale-95 relative ${activeTab === 'chat' ? 'text-black' : 'text-black/40'}`}
        >
          <MessageSquare className="w-6 h-6" />
          <span className="text-[10px] font-black mt-1 uppercase tracking-wider">Assistant</span>
          {activeTab === 'chat' && <div className="absolute bottom-1 w-12 h-0.5 bg-black rounded-full" />}
        </button>
      </nav>

    </div>
  );
};

export default ShadsAIHub;
