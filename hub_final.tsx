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
  Plus,
  Search
} from 'lucide-react';

// Imports des composants originaux
import { HistorySidebar } from '../sidebar/HistorySidebar';
import { ChatArea } from './ChatArea';
import { AppModals } from '../modals/AppModals';
import { SidePanel } from './SidePanel';
import { AddOpportunityForm } from './AddOpportunityForm';

// Types et Données externalisés
import { Opportunity } from '../../types/opportunity';
import { OPPORTUNITIES_DATA } from '../../constants/opportunities';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);

  // Chargement initial et synchronisation temps réel
  React.useEffect(() => {
    const updateList = () => {
      const saved = localStorage.getItem('shads_opps_master');
      setOpportunities(saved ? JSON.parse(saved) : OPPORTUNITIES_DATA);
    };

    updateList();

    window.addEventListener('storage', updateList);
    window.addEventListener('focus', updateList);
    return () => {
      window.removeEventListener('storage', updateList);
      window.removeEventListener('focus', updateList);
    };
  }, []);

  const otherOpps = opportunities
    .filter(o => (filterType === 'Tous' || o.type === filterType))
    .filter(o => (
      (o.title?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (o.organization?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    ))
    .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

  return (
    <div className={`flex flex-col h-full w-full overflow-hidden bg-[var(--theme-bg-primary)] text-[var(--theme-text-primary)] transition-colors duration-300 relative`}>

      {/* MOBILE HEADER */}
      <header className="flex md:hidden items-center justify-between px-4 py-3 border-b border-[var(--theme-border-primary)] bg-[var(--theme-bg-secondary)] z-[100]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[var(--theme-text-accent)]" />
          <span className="font-black text-sm uppercase tracking-tighter">ShadsAI Hub</span>
        </div>
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
          <div className="w-8 h-8 rounded-full bg-[var(--theme-bg-tertiary)] border border-[var(--theme-border-primary)] overflow-hidden">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      <div className="flex-1 relative overflow-hidden">
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
                  <div className="space-y-4 flex-1">
                    <h3 className="text-3xl font-black uppercase tracking-tight text-[var(--theme-text-primary)]">Opportunities Board</h3>
                    <div className="relative max-w-md group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--theme-text-tertiary)] group-focus-within:text-[var(--theme-bg-accent)] transition-colors" />
                      <input
                        type="text"
                        placeholder="Rechercher une annonce..."
                        className="w-full bg-[var(--theme-bg-secondary)] border border-[var(--theme-border-primary)] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[var(--theme-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-bg-accent)]/30 transition-all shadow-inner"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
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
                    <div key={opp.id} onClick={() => setSelectedOpp(opp)} className={`group flex flex-col bg-[var(--theme-bg-secondary)] border ${opp.featured ? 'border-[var(--theme-bg-accent)] shadow-xl' : 'border-[var(--theme-border-secondary)]'} rounded-[2.5rem] overflow-hidden cursor-pointer hover:border-[var(--theme-bg-accent)]/40 transition-all duration-500 relative`}>
                      {opp.featured && (
                        <div className="absolute top-4 right-4 z-20 bg-[var(--theme-bg-accent)] text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-white" /> ÉLITE
                        </div>
                      )}
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
                <div className="relative h-[45vh] md:h-[70vh] w-full overflow-hidden rounded-b-[5rem] shadow-2xl group/hero">
                  <img
                    src={selectedOpp.image}
                    className="w-full h-full object-cover object-[50%_35%] scale-110 group-hover/hero:scale-[1.15] transition-transform duration-[2000ms] ease-out"
                  />
                  {/* Overlay dégradé multicouche pour un rendu cinéma */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--theme-bg-primary)] via-transparent to-transparent opacity-60"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                  <div className="absolute top-8 left-8 z-10">
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

                      {/* Barre d'informations clés */}
                      <div className="flex flex-wrap gap-4 pt-4">
                        <div className="flex items-center gap-2 px-4 py-2 bg-[var(--theme-bg-secondary)] border border-[var(--theme-border-primary)] rounded-xl text-xs font-bold uppercase tracking-wider">
                          <Clock className="w-4 h-4 text-[var(--theme-bg-accent)]" /> {selectedOpp.deadline}
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-[var(--theme-bg-secondary)] border border-[var(--theme-border-primary)] rounded-xl text-xs font-bold uppercase tracking-wider">
                          <Sparkles className="w-4 h-4 text-[var(--theme-bg-accent)]" /> {selectedOpp.location}
                        </div>
                        {selectedOpp.reward && (
                          <div className="flex items-center gap-2 px-4 py-2 bg-[var(--theme-bg-accent)]/10 border border-[var(--theme-bg-accent)]/20 rounded-xl text-xs font-black text-[var(--theme-bg-accent)] uppercase tracking-wider">
                            ✨ {selectedOpp.reward}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-[var(--theme-text-secondary)] max-w-none pt-8 border-t border-[var(--theme-border-primary)]">
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
                    <div className="lg:sticky lg:top-[40%] space-y-4 w-full max-w-sm mx-auto lg:ml-auto mt-12 lg:mt-0 z-50">
                      <button
                        onClick={() => {
                          if (selectedOpp.link) {
                            // On s'assure que le lien commence par http pour éviter les erreurs de redirection locale
                            const url = selectedOpp.link.startsWith('http') ? selectedOpp.link : `https://${selectedOpp.link}`;
                            window.open(url, '_blank', 'noopener,noreferrer');
                          }
                        }}
                        className="w-full bg-[var(--theme-bg-accent)] hover:bg-[var(--theme-bg-accent-hover)] text-[var(--theme-text-accent)] font-black py-3 md:py-5 rounded-xl md:rounded-[2rem] shadow-xl transition-all flex items-center justify-center gap-3 group active:scale-95 text-sm md:text-lg uppercase tracking-tight"
                      >
                        POSTULER MAINTENANT <ArrowRight className="w-5 h-5 md:w-6 h-6 group-hover:translate-x-2 transition-transform" />
                      </button>
                      <button
                        onClick={() => {
                          const detailedPrompt = `Bonjour ! Je souhaite préparer ma candidature pour l'opportunité suivante :

📌 **${selectedOpp.title}** (${selectedOpp.organization})
📅 Date limite : ${selectedOpp.deadline}

Voici les détails de l'offre :
---
${selectedOpp.fullContent}
---

Peux-tu m'aider à rédiger un CV et une lettre de motivation percutante pour cette offre ? Donne-moi aussi 3 conseils clés pour réussir l'entretien.`;

                          if (chatAreaProps.onSendMessage) {
                            if (chatAreaProps.onNewChat) chatAreaProps.onNewChat();
                            setTimeout(() => {
                              chatAreaProps.onSendMessage(detailedPrompt);
                              setActiveTab('chat');
                            }, 100);
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
