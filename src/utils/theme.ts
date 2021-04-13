import { writable, Readable } from "svelte/store";

export interface ThemeStore extends Readable<boolean> {
	toggle(): void
}

export function darkTheme(): ThemeStore {
  const initialValue = localStorage.darkTheme ? localStorage.darkTheme === "true" : window.matchMedia('(prefers-color-scheme: dark)').matches;

  const { subscribe, set, update } = writable(initialValue);
  const apply = (isDark: boolean) => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  apply(initialValue);

  return {
    subscribe,
    toggle: () => {
      update((v) => {
        const newValue = !v;
        apply(newValue);
        localStorage.darkTheme = newValue;
        return newValue;
      });
    }
  }
}