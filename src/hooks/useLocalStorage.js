import { useEffect, useState } from 'react';

const isPlainObject = (v) => v && typeof v === 'object' && !Array.isArray(v);

export default function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return initial;
      const parsed = JSON.parse(raw);
      return isPlainObject(initial) && isPlainObject(parsed) ? { ...initial, ...parsed } : parsed;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* تجاهل أخطاء التخزين */
    }
  }, [key, value]);

  return [value, setValue];
}
