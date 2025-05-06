import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';
import Router from './Router';
import { appTheme } from './shared/appTheme';
import { queryClient } from './shared/queryClient';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './style.css';

const root = createRoot(document.getElementById('root'));

root.render(
  <MantineProvider theme={appTheme}>
    <Notifications autoClose={5000} color="var(--color-success)" />
    <ModalsProvider />
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  </MantineProvider>
);
