import { BrowserRouter, Route, Routes } from 'react-router-dom';
import FrontPage from './Pages/FrontPage';
import DocumentsPage from './Pages/DocumentsPage';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<FrontPage />} />
                <Route path="documents" element={<DocumentsPage />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
