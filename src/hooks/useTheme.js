import { useState, useEffect } from 'react';

// tu peux aussi déplacer tes themes ici si tu veux
const lightTheme = { /* ... */ };
const darkTheme = { /* ... */ };

const useTheme = () => {
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
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  return { theme, toggle };
};

export default useTheme;