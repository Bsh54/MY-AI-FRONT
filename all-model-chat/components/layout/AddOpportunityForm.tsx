import React, { useState } from 'react';
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
  Clock
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface AddOpportunityFormProps {
  onClose: () => void;
  onAdd: (opportunity: any) => void;
}

export const AddOpportunityForm: React.FC<AddOpportunityFormProps> = ({ onClose, onAdd }) => {
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

  const [isPreview, setIsPreview] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      id: Date.now().toString(),
    });
  };

  const inputClass = "w-full bg-[var(--theme-bg-tertiary)] border border-[var(--theme-border-primary)] rounded-xl px-4 py-3 text-[var(--theme-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-bg-accent)] transition-all";
  const labelClass = "text-[10px] font-black uppercase tracking-widest text-[var(--theme-text-tertiary)] mb-2 block";

  return (
    <div className="flex flex-col h-full bg-[var(--theme-bg-primary)] animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header du Formulaire */}
      <div className="flex items-center justify-between p-6 border-b border-[var(--theme-border-primary)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[var(--theme-bg-accent)] rounded-xl flex items-center justify-center text-white">
            <Plus className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-tighter">Nouvelle Opportunité</h2>
            <p className="text-xs text-[var(--theme-text-tertiary)] font-bold uppercase">Ajouter du contenu à la plateforme</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPreview(!isPreview)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${isPreview ? 'bg-[var(--theme-bg-accent)] text-white' : 'hover:bg-[var(--theme-bg-secondary)] text-[var(--theme-text-secondary)]'}`}
          >
            {isPreview ? <FileText className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {isPreview ? "Éditer" : "Aperçu"}
          </button>
          <button onClick={onClose} className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-12">
        {!isPreview ? (
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Section Image */}
            <div className="md:col-span-2 space-y-4">
              <label className={labelClass}>URL de l'image de couverture</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--theme-text-tertiary)]">
                  <Upload className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  className={`${inputClass} pl-12`}
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  required
                />
              </div>
              {formData.image && (
                <div className="h-48 w-full rounded-2xl overflow-hidden border border-[var(--theme-border-primary)] shadow-inner">
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* Titre et Organisation */}
            <div className="space-y-4">
              <label className={labelClass}>Nom de l'opportunité</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--theme-text-tertiary)]">
                  <Type className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  className={`${inputClass} pl-12`}
                  placeholder="Ex: Bourse d'excellence..."
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className={labelClass}>Organisation / Source</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--theme-text-tertiary)]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  className={`${inputClass} pl-12`}
                  placeholder="Ex: ShadsAI Foundation"
                  value={formData.organization}
                  onChange={(e) => setFormData({...formData, organization: e.target.value})}
                  required
                />
              </div>
            </div>

            {/* Type et Status */}
            <div className="space-y-4">
              <label className={labelClass}>Type d'opportunité</label>
              <select
                className={inputClass}
                value={formData.type}
                onChange={(e: any) => setFormData({...formData, type: e.target.value})}
              >
                {['Bourse', 'Concours', 'Stage', 'Conférence', 'Mentorat'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div className="space-y-4">
              <label className={labelClass}>Lien officiel / Postuler</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--theme-text-tertiary)]">
                  <LinkIcon className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  className={`${inputClass} pl-12`}
                  placeholder="https://..."
                  value={formData.link}
                  onChange={(e) => setFormData({...formData, link: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className={labelClass}>Date limite</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--theme-text-tertiary)]">
                  <Calendar className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  className={`${inputClass} pl-12`}
                  placeholder="Ex: 15 Mars 2026"
                  value={formData.deadline}
                  onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                  required
                />
              </div>
            </div>

            {/* Contenu Markdown */}
            <div className="md:col-span-2 space-y-4">
              <label className={labelClass}>Contenu détaillé (Format Markdown supporté)</label>
              <textarea
                className={`${inputClass} min-h-[300px] resize-none font-mono text-sm`}
                placeholder="# Utilisez le markdown pour structurer votre texte... \n\n**Points clés :**\n- Avantage 1\n- Avantage 2"
                value={formData.fullContent}
                onChange={(e) => setFormData({...formData, fullContent: e.target.value})}
                required
              />
            </div>

            <div className="md:col-span-2 pt-8">
              <button
                type="submit"
                className="w-full bg-[var(--theme-bg-accent)] hover:bg-[var(--theme-bg-accent-hover)] text-white font-black py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 text-lg uppercase tracking-tight group"
              >
                PUBLIER L'OPPORTUNITÉ <CheckCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </form>
        ) : (
          <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-300">
            {/* Aperçu de la carte */}
            <div className="space-y-6 text-center md:text-left">
              <label className={labelClass}>Aperçu de la carte (Grid)</label>
              <div className="max-w-sm mx-auto md:mx-0 bg-[var(--theme-bg-secondary)] border border-[var(--theme-border-secondary)] rounded-[2.5rem] overflow-hidden">
                <div className="h-48 relative overflow-hidden bg-black/10">
                  {formData.image && <img src={formData.image} className="w-full h-full object-cover" />}
                  <div className="absolute top-4 left-4">
                    <span className="bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">{formData.type}</span>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-[var(--theme-bg-accent)] text-[9px] font-black uppercase tracking-[0.2em] mb-2">{formData.organization || "Organisation"}</p>
                  <h4 className="text-xl font-bold leading-tight mb-4">{formData.title || "Titre de l'opportunité"}</h4>
                  <div className="pt-4 border-t border-[var(--theme-border-primary)] flex items-center gap-2 text-[var(--theme-text-tertiary)] text-[10px] font-bold uppercase">
                    <Clock className="w-3 h-3" /> {formData.deadline || "Date limite"}
                  </div>
                </div>
              </div>
            </div>

            {/* Aperçu du contenu */}
            <div className="space-y-6">
              <label className={labelClass}>Aperçu du contenu détaillé</label>
              <div className="bg-[var(--theme-bg-secondary)] p-8 rounded-3xl border border-[var(--theme-border-primary)]">
                <div className="text-[var(--theme-text-secondary)]">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: (props) => <h1 className="text-3xl font-black text-[var(--theme-text-primary)] mb-6 mt-8 uppercase border-b-2 border-[var(--theme-bg-accent)] pb-2" {...props} />,
                      h2: (props) => <h2 className="text-xl font-black text-[var(--theme-text-primary)] mb-4 mt-6 uppercase flex items-center gap-2 before:content-[''] before:w-1.5 before:h-6 before:bg-[var(--theme-bg-accent)] before:rounded-full" {...props} />,
                      p: (props) => <p className="text-base leading-relaxed mb-4 opacity-90" {...props} />,
                      strong: (props) => <strong className="text-[var(--theme-bg-accent)] font-black" {...props} />,
                      ul: (props) => <ul className="space-y-2 mb-6 ml-4" {...props} />,
                      li: (props) => <li className="flex items-start gap-2 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--theme-bg-accent)] shrink-0" /><span {...props} /></li>,
                    }}
                  >
                    {formData.fullContent || "*Aucun contenu rédigé pour le moment.*"}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
