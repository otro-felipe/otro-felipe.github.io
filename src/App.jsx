import { CssBaseline, ThemeProvider } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import RiftboundRules from './pages/RiftboundRules.jsx';
import appTheme from './theme/appTheme.js';

function App() {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reglas-riftbound" element={<RiftboundRules />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
