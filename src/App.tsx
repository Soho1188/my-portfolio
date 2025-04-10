import Resume from './views/resume';
import { Toaster } from '@/components/ui/sonner';
import '@/animationcss/animation.css'; // Import the animations CSS file

function App() {
  return (
    <div className="app">
      <Resume />
      <Toaster />
    </div>
  );
}

export default App;