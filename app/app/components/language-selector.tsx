import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface LanguageSelectorProps {
  onLanguageChange: (language: string) => void
  selectedLanguage: string
}

const languages = [
  { name: 'Indonesia' },
  { name: 'English' },
  { name: 'Español' },
  { name: 'Français' },
  { name: 'Deutsch' },
  { name: 'Italiano' },
  { name: 'Português' },
  { name: 'Русский' },
  { name: '中文' },
  { name: '日本語' },
  { name: '한국어' },
]

export function LanguageSelector({ onLanguageChange, selectedLanguage }: LanguageSelectorProps) {
  return (
    <Select onValueChange={onLanguageChange} value={selectedLanguage}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select Language" />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.name} value={lang.name}>
            {lang.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
