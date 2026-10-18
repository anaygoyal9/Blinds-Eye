import React from 'react';
import { Home, Compass, Bell, Settings } from 'lucide-react';

export type MobileTab = 'home' | 'navigate' | 'alerts' | 'settings';

interface BottomNavProps {
  currentTab: MobileTab;
  onSelectTab: (tab: MobileTab) => void;
  hasActiveAlert?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  hasActiveAlert = false,
}) => {
  const tabs: Array<{
    id: MobileTab;
    label: string;
    icon: (isActive: boolean) => React.ReactNode;
  }> = [
    {
      id: 'home',
      label: 'Home',
      icon: (isActive) => (
        <Home
          className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform ${
            isActive ? 'scale-110 text-[var(--color-focus)] stroke-[2.5]' : 'text-[var(--text-muted)]'
          }`}
          aria-hidden="true"
        />
      ),
    },
    {
      id: 'navigate',
      label: 'Navigate',
      icon: (isActive) => (
        <Compass
          className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform ${
            isActive ? 'scale-110 text-[var(--color-focus)] stroke-[2.5]' : 'text-[var(--text-muted)]'
          }`}
          aria-hidden="true"
        />
      ),
    },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: (isActive) => (
        <div className="relative">
          <Bell
            className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform ${
              isActive ? 'scale-110 text-[var(--color-focus)] stroke-[2.5]' : 'text-[var(--text-muted)]'
            }`}
            aria-hidden="true"
          />
          {hasActiveAlert && (
            <span
              className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse border-2 border-[var(--bg-card)]"
              aria-label="Active alert pending"
            />
          )}
        </div>
      ),
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: (isActive) => (
        <Settings
          className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform ${
            isActive ? 'scale-110 text-[var(--color-focus)] stroke-[2.5]' : 'text-[var(--text-muted)]'
          }`}
          aria-hidden="true"
        />
      ),
    },
  ];

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--bg-card)]/95 backdrop-blur-md border-t border-[var(--border-subtle)] px-2 py-1.5 max-w-md mx-auto transition-colors"
      style={{ paddingBottom: 'max(0.375rem, env(safe-area-inset-bottom))' }}
    >
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer min-h-[48px] ${
                isActive
                  ? 'text-[var(--color-focus)] font-black'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] font-medium'
              }`}
              aria-label={`${tab.label} Tab`}
              aria-current={isActive ? 'page' : undefined}
            >
              {tab.icon(isActive)}
              <span className="text-[11px] sm:text-xs tracking-tight mt-1">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
