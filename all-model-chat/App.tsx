
import React from 'react';
import { useAppLogic } from './hooks/app/useAppLogic';
import { useAppProps } from './hooks/app/useAppProps';
import { WindowProvider } from './contexts/WindowContext';
import ShadsAIHub from './components/layout/ShadsAIHub';

const App: React.FC = () => {
  const logic = useAppLogic();
  const {
    currentTheme,
    sidePanelContent,
    handleCloseSidePanel,
    uiState,
  } = logic;

  const { sidebarProps, chatAreaProps, appModalsProps } = useAppProps(logic);

  return (
    <WindowProvider>
      <div className={`relative flex h-full bg-[var(--theme-bg-secondary)] text-[var(--theme-text-primary)] theme-${currentTheme.id} overflow-hidden`}>
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
      </div>
    </WindowProvider>
  );
};

export default App;