import React from 'react';
import {
  Headphones,
  Mic,
  BookOpen,
  PenTool,
  Binary,
  Layers,
  Award,
} from 'lucide-react';
import { MaharahType } from '../types/arabic.ts';

interface TabsNavProps {
  activeTab: MaharahType;
  onSelectTab: (tab: MaharahType) => void;
}

export const TabsNav: React.FC<TabsNavProps> = ({ activeTab, onSelectTab }) => {
  const tabs = [
    {
      id: 'mufradat' as MaharahType,
      label: 'Mufradat',
      arabic: 'المُفْرَدَاتُ',
      icon: Layers,
      color: 'emerald',
    },
    {
      id: 'istima' as MaharahType,
      label: '1. Istima\'',
      arabic: 'الاسْتِمَاعُ',
      icon: Headphones,
      color: 'blue',
      badge: 'Audio',
    },
    {
      id: 'kalam' as MaharahType,
      label: '2. Kalam',
      arabic: 'الْكَلَامُ',
      icon: Mic,
      color: 'indigo',
      badge: 'Bicara',
    },
    {
      id: 'qiraah' as MaharahType,
      label: '3. Qira\'ah',
      arabic: 'الْقِرَاءَةُ',
      icon: BookOpen,
      color: 'teal',
      badge: 'Bacaan',
    },
    {
      id: 'kitabah' as MaharahType,
      label: '4. Kitabah',
      arabic: 'الْكِتَابَةُ',
      icon: PenTool,
      color: 'amber',
      badge: 'Menulis',
    },
    {
      id: 'tarkib' as MaharahType,
      label: 'Tarkib',
      arabic: 'التَّرَاكِيْبُ',
      icon: Binary,
      color: 'purple',
      badge: 'Qawa\'id',
    },
    {
      id: 'ikhtibar' as MaharahType,
      label: 'Ujian Bab',
      arabic: 'الاِخْتِبَارُ',
      icon: Award,
      color: 'rose',
      badge: 'Sertifikat',
    },
  ];

  return (
    <div className="bg-white border-b border-slate-200 shadow-xs sticky top-18 sm:top-20 z-30">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2.5 no-scrollbar scroll-smooth">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="font-medium">{tab.label}</span>
                <span className={`font-arabic text-sm ${isActive ? 'text-emerald-100 font-bold' : 'text-slate-400'}`}>
                  {tab.arabic}
                </span>
                {tab.badge && !isActive && (
                  <span className="hidden md:inline text-[10px] px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-500 font-normal">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
