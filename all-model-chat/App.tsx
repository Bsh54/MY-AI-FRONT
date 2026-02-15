
import React from 'react';
import { useAppLogic } from './hooks/app/useAppLogic';
import { useAppProps } from './hooks/app/useAppProps';
import { WindowProvider } from './contexts/WindowContext';
import ShadsAIHub from './components/layout/ShadsAIHub';
import { AddOpportunityForm } from './components/layout/AddOpportunityForm';

const App: React.FC = () => {
  const logic = useAppLogic();
  const {
    currentTheme,
    sidePanelContent,
    handleCloseSidePanel,
    uiState,
  } = logic;

  const { sidebarProps, chatAreaProps, appModalsProps } = useAppProps(logic);

  // Système de routage ultra-simple pour l'admin
  const isAdmin = window.location.pathname === '/admin-portal';

  return (
    <WindowProvider>
      <div className={`relative flex h-full bg-[var(--theme-bg-secondary)] text-[var(--theme-text-primary)] theme-${currentTheme.id} overflow-hidden`}>
        {isAdmin ? (
          <div className="w-full h-full bg-[var(--theme-bg-primary)]">
            <AddOpportunityForm
              onClose={() => window.location.href = '/'}
              onAdd={(newOpp) => {
                const saved = localStorage.getItem('custom_opportunities');
                const existing = saved ? JSON.parse(saved) : [];
                localStorage.setItem('custom_opportunities', JSON.stringify([newOpp, ...existing]));
                // On ne redirige plus, le composant AddOpportunityForm gère son animation de succès
              }}
            />
          </div>
        ) : (
          <ShadsAIHub
            sidebarProps={sidebarProps}
            chatAreaProps={chatAreaProps}
            appModalsProps={appModalsProps}
            isHistorySidebarOpen={uiState.isHistorySidebarOpen}
            setIsHistorySidebarOpen={uiState.setIsHistorySidebarOpen}
            sidePanelContent={sidePanelContent}
            onCloseSidePanel={handleCloseSidePanel}
            themeId={currentTheme.id}
            currentTheme={currentTheme}
          />
        )}
      </div>
    </WindowProvider>
  );
};

export default App;