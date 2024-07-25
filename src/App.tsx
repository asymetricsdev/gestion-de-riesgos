import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ShowUsers from './components/ShowUsers';

export function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<ShowUsers />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
