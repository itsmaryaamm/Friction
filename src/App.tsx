import FrictionDemo from './FrictionDemo';
import LiveApp from './live/LiveApp';

/**
 * Phones (and anything opened with ?pause or ?app) get the real Friction app.
 * Larger screens, or ?demo, get the investor demo.
 */
function useLiveApp() {
  const p = new URLSearchParams(window.location.search);
  if (p.has('demo')) return false;
  if (p.has('pause') || p.has('app')) return true;
  return window.matchMedia('(max-width: 500px)').matches;
}

export default function App() {
  return useLiveApp() ? <LiveApp /> : <FrictionDemo showPanels pauseSeconds={15} />;
}
