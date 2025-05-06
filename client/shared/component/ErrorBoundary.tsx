import { useRouteError } from 'react-router';

export default function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);
  return <div className="page">Oops! an unexpected error occurred.</div>;
}
