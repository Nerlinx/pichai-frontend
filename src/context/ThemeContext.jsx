import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

// ─── DESIGN TOKENS (thème clair/sombre) ──────────────────────────
const lightTheme = {
  bg          : '#FFFFFF',
  bgScrolled  : 'rgba(255,255,255,0.96)',
  border      : '#E2E8F0',
  borderStrong: '#CBD5E1',
  text        : '#0A0F1E',
  textSub     : '#4A5875',
  textMuted   : '#94A3B8',
  accent      : '#0050E6',
  accentSoft  : '#F1F5F9',
  surface     : '#F8FAFC',
  drawerBg    : '#FFFFFF',
  overlay     : 'rgba(10,15,30,0.45)',
  inputBg     : '#FFFFFF',
};

const darkTheme = {
  bg          : '#0B0E14',
  bgScrolled  : 'rgba(11,14,20,0.96)',
  border      : '#2A323F',
  borderStrong: '#3B4252',
  text        : '#F0F3F8',
  textSub     : '#9AA6B9',
  textMuted   : '#6C7A8E',
  accent      : '#3B82F6',
  accentSoft  : '#1E293B',
  surface     : '#11161F',
  drawerBg    : '#11161F',
  overlay     : 'rgba(0,0,0,0.7)',
  inputBg     : '#1A212C',
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('pichai-theme');
    return saved === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('pichai-theme', theme);

    const colors = theme === 'dark' ? darkTheme : lightTheme;

    Object.entries(colors).forEach(([key, val]) => {
      document.documentElement.style.setProperty(
        `--hdr-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`,
        val
      );
    });
  }, [theme]);

  const toggle = () =>
    setTheme(t => (t === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);