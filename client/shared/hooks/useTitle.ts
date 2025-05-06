import { useEffect } from 'react';
import { appName } from '../const.js';

export const useTitle = (title: string) => {
  useEffect(() => {
    if (!title) {
      return;
    }
    const oldTitle = document.title;
    if (title) {
      document.title = title + ' | ' + appName;
    }
    return () => {
      document.title = oldTitle;
    };
  }, [title]);
};
