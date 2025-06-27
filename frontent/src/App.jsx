
import Home from './pages/home'
import { Routes, Route, Link } from 'react-router-dom';
import Search from './pages/search.jsx';
import Book from './pages/book.jsx';
function App() {

  return (
    <div>
      <Routes>
        <Route path="/" e lement={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/book" element={<Book />} />
        </Routes>
     </div>
  )
}

export default App
