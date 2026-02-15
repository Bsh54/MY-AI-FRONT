import React, { useState, useMemo } from 'react';
import {
  X,
  Upload,
  Link as LinkIcon,
  Type,
  FileText,
  Calendar,
  CheckCircle,
  Eye,
  Plus,
  Sparkles,
  Clock,
  Trash2,
  Edit3,
  Settings2,
  LayoutGrid,
  Search,
  Lock
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { OPPORTUNITIES_DATA } from '../../constants/opportunities';
import { Opportunity } from '../../types/opportunity';

interface AddOpportunityFormProps {
  onClose: () => void;
  onAdd: (allOpportunities: Opportunity[]) => void;
}

/**
 * Composant principal de gestion des opportunités (Dashboard Admin).
 * Permet la création, modification et suppression.
 */
export const AddOpportunityForm: React.FC<AddOpportunityFormProps> = ({ onClose, onAdd }) => {
  const [adminTab, setAdminTab] = useState<'create' | 'manage'>('create');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    type: 'Bourse' as const,
    title: '',
    organization: '',
    description: '',
    fullContent: '',
    deadline: '',
    location: '',
    image: '',
    link: '',
    status: 'Ouvert' as const,
    reward: ''
  });

  const [allOpps, setAllOpps] = useState<Opportunity[]>(() => {
    const saved = localStorage.getItem('shads_opps_master');
    return saved ? JSON.parse(saved) : OPPORTUNITIES_DATA;
  });

  // Liste complète filtrée
  const filteredOpps = useMemo(() => {
    if (!searchQuery) return allOpps;
    return allOpps.filter(o =>
      (o.title?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (o.organization?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    );
  }, [allOpps, searchQuery]);

  const [isPreview, setIsPreview] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let updated;
    if (editingId) {
      updated = allOpps.map(o => o.id === editingId ? { ...formData, id: editingId } : o);
    } else {
      const newOpp = { ...formData, id: Date.now().toString() };
      updated = [newOpp, ...allOpps];
    }

    setAllOpps(updated);
    localStorage.setItem('shads_opps_master', JSON.stringify(updated));

    // Signaler le changement immédiatement au Hub
    window.dispatchEvent(new Event('storage'));

    onAdd(updated);
    setShowSuccess(true);
  };

  const handleReset = () => {
    setShowSuccess(false);
    setEditingId(null);
    setFormData({
      type: 'Bourse' as const,
      title: '',
      organization: '',
      description: '',
      fullContent: '',
      deadline: '',
      location: '',
      image: '',
      link: '',
      status: 'Ouvert' as const,
      reward: ''
    });
    setIsPreview(false);
    setAdminTab('create');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Supprimer cette opportunité définitivement ?')) {
      const updated = allOpps.filter(o => o.id !== id);
      setAllOpps(updated);
      localStorage.setItem('shads_opps_master', JSON.stringify(updated));

      // Signaler le changement immédiatement au Hub
      window.dispatchEvent(new Event('storage'));

      onAdd(updated);
    }
  };

  const startEdit = (opp: Opportunity) => {
    setFormData({
      ...opp,
      type: opp.type as any,
      status: opp.status as any
    });
    setEditingId(opp.id);
    setAdminTab('create');
  };

  const inputClass = "w-full bg-[var(--theme-bg-tertiary)] border border-[var(--theme-border-primary)] rounded-xl px-4 py-3 text-[var(--theme-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-bg-accent)] transition-all";
  const labelClass = "text-[10px] font-black uppercase tracking-widest text-[var(--theme-text-tertiary)] mb-2 block";

  return (
    <div className="flex flex-col h-full bg-[var(--theme-bg-primary)] animate-in fade-in duration-500">
      {/* Admin Navbar */}
      <div className="flex items-center justify-between p-6 border-b border-[var(--theme-border-primary)] bg-[var(--theme-bg-secondary)]/50 backdrop-blur-md sticky top-0 z-[100]">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--theme-bg-accent)] rounded-xl flex items-center justify-center text-white shadow-lg">
              <Settings2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black uppercase tracking-tighter hidden md:block">Admin Dashboard</h2>
          </div>

          <nav className="flex bg-[var(--theme-bg-tertiary)] rounded-xl p-1 border border-[var(--theme-border-primary)]">
            <button
              onClick={() => { setAdminTab('create'); setShowSuccess(false); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${adminTab === 'create' ? 'bg-[var(--theme-bg-accent)] text-white shadow-md' : 'text-[var(--theme-text-tertiary)] hover:text-[var(--theme-text-primary)]'}`}
            >
              <Plus className="w-3.5 h-3.5" /> {editingId ? 'Modifier' : 'Nouveau'}
            </button>
            <button
              onClick={() => { setAdminTab('manage'); setShowSuccess(false); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${adminTab === 'manage' ? 'bg-[var(--theme-bg-accent)] text-white shadow-md' : 'text-[var(--theme-text-tertiary)] hover:text-[var(--theme-text-primary)]'}`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Gestion ({filteredOpps.length})
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {adminTab === 'create' && !showSuccess && (
            <button
              onClick={() => setIsPreview(!isPreview)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${isPreview ? 'bg-[var(--theme-bg-accent)] text-white' : 'hover:bg-[var(--theme-bg-secondary)] text-[var(--theme-text-secondary)] border border-transparent hover:border-[var(--theme-border-primary)]'}`}
            >
              {isPreview ? <Edit3 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {isPreview ? "Éditer" : "Aperçu"}
            </button>
          )}
          <button onClick={onClose} className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {showSuccess ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 animate-in fade-in zoom-in duration-500">
            <div className="w-32 h-32 bg-[var(--theme-bg-accent)] rounded-full flex items-center justify-center mb-10 shadow-[0_0_80px_rgba(var(--theme-bg-accent-rgb),0.4)] animate-bounce text-white">
              <CheckCircle className="w-16 h-16" />
            </div>
            <h3 className="text-5xl font-black uppercase tracking-tighter mb-6 text-[var(--theme-text-primary)]">
              {editingId ? 'Mise à jour Réussie !' : 'Publication Réussie !'}
            </h3>
            <p className="text-2xl text-[var(--theme-text-secondary)] font-medium max-w-xl opacity-90 mb-12">
              Vos modifications ont été enregistrées avec succès.
            </p>
            <div className="flex flex-col md:flex-row gap-4">
              <button
                onClick={handleReset}
                className="group flex items-center gap-4 bg-[var(--theme-bg-accent)] text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl"
              >
                <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
                Nouveau Contenu
              </button>
              <button
                onClick={() => setAdminTab('manage')}
                className="px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest border-2 border-[var(--theme-border-primary)] hover:bg-[var(--theme-bg-secondary)] transition-all"
              >
                Gérer la liste
              </button>
            </div>
          </div>
        ) : adminTab === 'create' ? (
          <div className="p-6 md:p-12 animate-in slide-in-from-bottom-4 duration-500">
            {!isPreview ? (
              <form onSubmit={handleSubmit} className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2 space-y-4">
                  <label className={labelClass}>Image de couverture (URL)</label>
                  <input type="text" className={inputClass} placeholder="https://..." value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} required />
                  {formData.image && <img src={formData.image} className="h-32 w-full object-cover rounded-xl mt-2 border border-[var(--theme-border-primary)]" alt="" />}
                </div>
                <div className="space-y-4">
                  <label className={labelClass}>Titre de l'opportunité</label>
                  <input type="text" className={inputClass} placeholder="Titre de l'annonce" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                </div>
                <div className="space-y-4">
                  <label className={labelClass}>Organisation</label>
                  <input type="text" className={inputClass} placeholder="Nom de l'entreprise" value={formData.organization} onChange={e => setFormData({...formData, organization: e.target.value})} required />
                </div>
                <div className="space-y-4">
                  <label className={labelClass}>Type</label>
                  <select className={inputClass} value={formData.type} onChange={(e: any) => setFormData({...formData, type: e.target.value})}>
                    {['Bourse', 'Concours', 'Stage', 'Conférence', 'Mentorat'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="space-y-4">
                  <label className={labelClass}>Lien Officiel</label>
                  <input type="text" className={inputClass} placeholder="https://..." value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} required />
                </div>
                <div className="space-y-4">
                  <label className={labelClass}>Date Limite</label>
                  <input type="text" className={inputClass} placeholder="Ex: 30 Juin 2026" value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} required />
                </div>
                <div className="space-y-4">
                  <label className={labelClass}>Lieu</label>
                  <input type="text" className={inputClass} placeholder="Ex: Paris / Remote" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required />
                </div>
                <div className="space-y-4">
                  <label className={labelClass}>Mise en avant</label>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, featured: !formData.featured as any})}
                    className={`w-full py-3 rounded-xl border-2 transition-all font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 ${formData.featured ? 'bg-[var(--theme-bg-accent)] border-[var(--theme-bg-accent)] text-white' : 'bg-transparent border-[var(--theme-border-primary)] text-[var(--theme-text-tertiary)]'}`}
                  >
                    <Sparkles className={`w-4 h-4 ${formData.featured ? 'animate-pulse' : ''}`} />
                    {formData.featured ? 'Opportunité Élite' : 'Standard'}
                  </button>
                </div>
                <div className="space-y-4">
                  <label className={labelClass}>Récompense / Rémunération</label>
                  <input type="text" className={inputClass} placeholder="Ex: 15.000 €" value={formData.reward} onChange={e => setFormData({...formData, reward: e.target.value})} />
                </div>
                <div className="space-y-4">
                  <label className={labelClass}>Statut</label>
                  <select className={inputClass} value={formData.status} onChange={(e: any) => setFormData({...formData, status: e.target.value})}>
                    {['Ouvert', 'Bientôt fini', 'Fermé'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2 space-y-4">
                  <label className={labelClass}>Contenu Markdown</label>
                  <textarea className={`${inputClass} min-h-[300px] font-mono text-sm`} value={formData.fullContent} onChange={e => setFormData({...formData, fullContent: e.target.value})} required />
                </div>
                <button type="submit" className="md:col-span-2 w-full bg-[var(--theme-bg-accent)] text-white font-black py-5 rounded-2xl shadow-xl hover:scale-[1.02] transition-all uppercase tracking-widest active:scale-95">
                  {editingId ? 'Sauvegarder les modifications' : 'Publier l\'opportunité'}
                </button>
              </form>
            ) : (
              <div className="max-w-4xl mx-auto space-y-12">
                <div className="bg-[var(--theme-bg-secondary)] p-8 rounded-3xl border border-[var(--theme-border-primary)] shadow-2xl">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
                    h1: (props) => <h1 className="text-3xl font-black text-[var(--theme-text-primary)] mb-6 mt-8 uppercase border-b-2 border-[var(--theme-bg-accent)] pb-2" {...props} />,
                    h2: (props) => <h2 className="text-xl font-black text-[var(--theme-text-primary)] mb-4 mt-6 uppercase flex items-center gap-2 before:content-[''] before:w-1.5 before:h-6 before:bg-[var(--theme-bg-accent)] before:rounded-full" {...props} />,
                    p: (props) => <p className="text-base leading-relaxed mb-4 opacity-90" {...props} />,
                    strong: (props) => <strong className="text-[var(--theme-bg-accent)] font-black" {...props} />,
                    ul: (props) => <ul className="space-y-2 mb-6 ml-4" {...props} />,
                    li: (props) => <li className="flex items-start gap-2 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--theme-bg-accent)] shrink-0" /><span {...props} /></li>,
                  }}>
                    {formData.fullContent || "*Contenu vide*"}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-6 md:p-12 animate-in fade-in duration-500">
            <div className="max-w-5xl mx-auto space-y-8">
              {/* Search Bar */}
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--theme-text-tertiary)] group-focus-within:text-[var(--theme-bg-accent)] transition-colors" />
                <input
                  type="text"
                  placeholder="Rechercher une opportunité..."
                  className="w-full bg-[var(--theme-bg-secondary)] border border-[var(--theme-border-primary)] rounded-2xl pl-12 pr-4 py-4 text-[var(--theme-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-bg-accent)]/50 transition-all shadow-inner"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Opportunities List */}
              <div className="grid grid-cols-1 gap-4">
                {filteredOpps.length === 0 ? (
                  <div className="text-center py-20 bg-[var(--theme-bg-secondary)] rounded-3xl border-2 border-dashed border-[var(--theme-border-primary)]">
                    <p className="text-[var(--theme-text-tertiary)] font-bold uppercase tracking-widest">Aucun résultat trouvé</p>
                  </div>
                ) : (
                  filteredOpps.map((opp: any) => (
                    <div key={opp.id} className="bg-[var(--theme-bg-secondary)] p-5 rounded-2xl border border-[var(--theme-border-primary)] flex items-center justify-between group hover:border-[var(--theme-bg-accent)]/50 transition-all shadow-sm">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-xl overflow-hidden shadow-md shrink-0 border border-[var(--theme-border-primary)]">
                          <img src={opp.image} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg leading-tight mb-1 text-[var(--theme-text-primary)]">{opp.title}</h4>
                          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-wider">
                            <span className="text-[var(--theme-bg-accent)]">{opp.type}</span>
                            <span className="text-[var(--theme-text-tertiary)]">•</span>
                            <span className="text-[var(--theme-text-tertiary)]">{opp.organization}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button aria-label="Modifier l opportunity" onClick={() => startEdit(opp)} className="p-3 bg-[var(--theme-bg-tertiary)] text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all shadow-sm">
                          <Edit3 className="w-5 h-5" />
                        </button>
                        <button aria-label="Supprimer l opportunity" onClick={() => handleDelete(opp.id)} className="p-3 bg-[var(--theme-bg-tertiary)] text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
// Button styles constants
