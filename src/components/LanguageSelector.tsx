
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  language: string;
  onLanguageChange: (language: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ language, onLanguageChange }) => {
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ms', name: 'Bahasa Melayu', flag: '🇲🇾' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
  ];

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-5 w-5 text-red-100" />
      <Select value={language} onValueChange={onLanguageChange}>
        <SelectTrigger className="w-40 bg-red-700 border-red-500 text-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              <div className="flex items-center gap-2">
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;
