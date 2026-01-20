
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Responsive, WidthProvider, Layout } from 'react-grid-layout';
import { RefreshCw, Layout as LayoutIcon, Lock, Unlock, Zap, Activity } from '../icons';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface WorkspacePanel {
  id: string;
  title: string;
  component: React.ReactNode;
  minW?: number;
  minH?: number;
}

interface WorkspaceManagerProps {
  screenId: string;
  panels: WorkspacePanel[];
  defaultLayouts: { lg: Layout[], md: Layout[] };
  mobileTabs: { id: string, label: string, icon: React.ReactNode }[];
}

const LAYOUT_VERSION = "1.0.0";

const WorkspaceManager: React.FC<WorkspaceManagerProps> = ({
  screenId,
  panels,
  defaultLayouts,
  mobileTabs
}) => {
  const [layouts, setLayouts] = useState(() => {
    const saved = localStorage.getItem(`dpal-layout-${screenId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.version === LAYOUT_VERSION) return parsed.layouts;
      } catch (e) {
        console.error("Layout parse error", e);
      }
    }
    return defaultLayouts;
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState(mobileTabs[0].id);
  const [focusedPanel, setFocusedPanel] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(`dpal-layout-${screenId}`, JSON.stringify({
      version: LAYOUT_VERSION,
      layouts
    }));
  }, [layouts, screenId]);

  const onLayoutChange = (currentLayout: Layout[], allLayouts: { [key: string]: Layout[] }) => {
    setLayouts(allLayouts);
  };

  const resetLayout = () => {
    if (confirm("Reset current workspace calibration?")) {
      setLayouts(defaultLayouts);
    }
  };

  const toggleFocus = (panelId: string) => {
    setFocusedPanel(focusedPanel === panelId ? null : panelId);
  };

  const currentPanels = useMemo(() => {
    if (focusedPanel) {
      return panels.filter(p => p.id === focusedPanel);
    }
    return panels;
  }, [panels, focusedPanel]);

  return (
    <div className="relative flex flex-col h-full w-full font-mono">
      {/* Workspace Controls Header */}
      <div className="flex items-center justify-between mb-4 bg-zinc-900/50 p-3 rounded-2xl border border-zinc-800 no-print">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3 px-4 py-1.5 bg-black/60 rounded-xl border border-zinc-800">
             <LayoutIcon className="w-4 h-4 text-cyan-500" />
             <span className="text-[10px] font-black uppercase tracking-widest text-white">Terminal_Workspace</span>
          </div>
          
          <div className="hidden lg:flex items-center space-x-4">
            <button 
              onClick={() => setIsEditMode(!isEditMode)}
              className={`flex items-center space-x-2 px-4 py-1.5 rounded-xl border-2 transition-all text-[9px] font-black uppercase tracking-widest ${
                isEditMode ? 'bg-cyan-600 border-cyan-400 text-white shadow-lg' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white'
              }`}
            >
              {isEditMode ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
              <span>{isEditMode ? 'Edit_Mode: ON' : 'Edit_Layout'}</span>
            </button>
            <button 
              onClick={resetLayout}
              className="flex items-center space-x-2 px-4 py-1.5 bg-zinc-800 border-2 border-zinc-700 rounded-xl text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:border-zinc-500 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 px-3 py-1 bg-emerald-950/20 border border-emerald-900/30 rounded-lg">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[8px] font-black uppercase text-emerald-500 tracking-widest">Workspace: Stable</span>
            </div>
        </div>
      </div>

      {/* Grid Display */}
      <div className="flex-grow relative overflow-hidden">
        {/* Mobile Tabbed View (Breakpoint sm) */}
        <div className="block lg:hidden h-full flex flex-col">
            <div className="flex-grow overflow-y-auto mb-20">
                {panels.find(p => p.id === activeMobileTab)?.component}
            </div>
            {/* Fixed Mobile Tab Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800 p-2 flex justify-around z-[100] sm:px-12">
                {mobileTabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveMobileTab(tab.id)}
                        className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all ${
                            activeMobileTab === tab.id ? 'text-cyan-400 bg-cyan-500/10' : 'text-zinc-600'
                        }`}
                    >
                        {React.cloneElement(tab.icon as React.ReactElement, { className: "w-5 h-5 mb-1" })}
                        <span className="text-[8px] font-black uppercase tracking-tighter">{tab.label}</span>
                    </button>
                ))}
            </div>
        </div>

        {/* Desktop/Tablet Grid View */}
        <div className="hidden lg:block h-full overflow-y-auto overflow-x-hidden custom-scrollbar">
          {focusedPanel ? (
              <div className="h-full w-full p-2">
                  {panels.find(p => p.id === focusedPanel)?.component}
              </div>
          ) : (
            <ResponsiveGridLayout
              className="layout"
              layouts={layouts}
              breakpoints={{ lg: 1200, md: 768 }}
              cols={{ lg: 12, md: 6 }}
              rowHeight={24}
              draggableHandle=".panel-drag-handle"
              isDraggable={isEditMode}
              isResizable={isEditMode}
              onLayoutChange={onLayoutChange}
              margin={[12, 12]}
              containerPadding={[0, 0]}
            >
              {panels.map(panel => (
                <div key={panel.id}>
                  {panel.component}
                </div>
              ))}
            </ResponsiveGridLayout>
          )}
        </div>
      </div>

      {isEditMode && (
          <div className="fixed bottom-10 right-10 z-[200] animate-bounce">
              <div className="bg-cyan-600 text-white px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-2xl flex items-center space-x-3">
                  <Unlock className="w-4 h-4" />
                  <span>Layout Editing Active</span>
              </div>
          </div>
      )}
    </div>
  );
};

export default WorkspaceManager;
