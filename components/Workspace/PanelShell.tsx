
import React from 'react';
import { Maximize2, Minimize2, ChevronDown, ChevronUp, GripVertical, X, MoreVertical } from '../icons';

interface PanelShellProps {
  id: string;
  title: string;
  children: React.ReactNode;
  isEditMode?: boolean;
  isCollapsed?: boolean;
  isFocused?: boolean;
  onToggleCollapse?: () => void;
  onToggleFocus?: () => void;
  onClose?: () => void;
  className?: string;
  headerContent?: React.ReactNode;
}

const PanelShell: React.FC<PanelShellProps> = ({
  id,
  title,
  children,
  isEditMode = false,
  isCollapsed = false,
  isFocused = false,
  onToggleCollapse,
  onToggleFocus,
  onClose,
  className = "",
  headerContent
}) => {
  return (
    <div 
      className={`h-full flex flex-col bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl transition-all ${
        isFocused ? 'ring-4 ring-cyan-500/50' : ''
      } ${className}`}
    >
      {/* Panel Header */}
      <div 
        className={`flex items-center justify-between px-5 py-3 border-b border-zinc-800 bg-zinc-950/50 flex-shrink-0 select-none ${
          isEditMode ? 'cursor-grab active:cursor-grabbing' : ''
        } panel-drag-handle`}
      >
        <div className="flex items-center space-x-3 truncate">
          {isEditMode && <GripVertical className="w-4 h-4 text-zinc-600 flex-shrink-0" />}
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-black text-cyan-500 uppercase tracking-widest truncate">{title}</span>
            <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-tight opacity-60 truncate">NODE::{id.toUpperCase()}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {headerContent}
          <div className="flex items-center space-x-1 border-l border-zinc-800 ml-2 pl-2">
            {onToggleFocus && (
              <button 
                onClick={(e) => { e.stopPropagation(); onToggleFocus(); }}
                className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-cyan-400 transition-all"
                title={isFocused ? "Restore" : "Focus"}
              >
                {isFocused ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
            )}
            {onToggleCollapse && (
              <button 
                onClick={(e) => { e.stopPropagation(); onToggleCollapse(); }}
                className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-white transition-all"
                title={isCollapsed ? "Expand" : "Collapse"}
              >
                {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
              </button>
            )}
            {onClose && (
              <button 
                onClick={(e) => { e.stopPropagation(); onClose(); }}
                className="p-1.5 hover:bg-rose-900/20 rounded-lg text-zinc-600 hover:text-rose-500 transition-all"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Panel Body */}
      {!isCollapsed && (
        <div className="flex-grow overflow-hidden relative">
          <div className="absolute inset-0 overflow-y-auto custom-scrollbar">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default PanelShell;
