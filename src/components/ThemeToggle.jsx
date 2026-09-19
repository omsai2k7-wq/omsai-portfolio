import { Moon, SunMedium } from 'lucide-react';

export default function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={onToggle}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className="theme-toggle__track">
        <span className="theme-toggle__thumb">
          {theme === 'dark' ? <Moon size={14} /> : <SunMedium size={14} />}
        </span>
      </span>
    </button>
  );
}
