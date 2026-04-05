import { Moon, Sun } from 'lucide-react';
import { cn } from '../lib/utils';
import { useTheme, type AppTheme } from '../context/ThemeContext';

const modes: { id: AppTheme; label: string; icon: typeof Sun }[] = [
  { id: 'day', label: 'Day', icon: Sun },
  { id: 'night', label: 'Night', icon: Moon },
];

export default function ThemeModeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border p-0.5 gap-0.5',
        'border-white/10 bg-white/[0.04] backdrop-blur-sm',
        'theme-toggle-shell',
        className
      )}
      role="group"
      aria-label="Color theme"
    >
      {modes.map(({ id, label, icon: Icon }) => {
        const active = theme === id;
        return (
          <button
            key={id}
            type="button"
            title={label}
            aria-pressed={active}
            aria-label={`${label} theme`}
            onClick={() => setTheme(id)}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200',
              active
                ? 'bg-red-600 text-white shadow-[0_0_12px_rgba(220,38,38,0.45)]'
                : 'text-slate-400 hover:text-white hover:bg-white/10'
            )}
          >
            <Icon className="h-4 w-4" strokeWidth={2.2} />
          </button>
        );
      })}
    </div>
  );
}
