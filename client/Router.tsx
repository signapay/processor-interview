import { lazy } from 'react';
import { type RouteObject, RouterProvider, createBrowserRouter, redirect } from 'react-router-dom';
import { AppLayout } from './AppLayout.js';
import Report from './report/Report.js';
import { defaultHome } from './shared/const.js';
import TransactionList from './transactions/TransactionList.js';

const ErrorBoundary = lazy(() => import('./shared/component/ErrorBoundary.js'));

export const routes = [
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <AppLayout />,
    children: [
      {
        path: 'transactions/*',
        index: true,
        element: <TransactionList />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: 'report',
        index: true,
        element: <Report />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: '',
        index: true,
        loader() {
          return redirect(defaultHome);
        },
        errorElement: <ErrorBoundary />,
      },
    ],
  },
] satisfies RouteObject[];

const router = createBrowserRouter(routes);

export default function Router() {
  return <RouterProvider router={router} />;
}
