import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navigation from "./components/Navigation";
import HomePage from "./pages/HomePage";
import BooksPage from "./pages/BooksPage";
import BorrowPage from "./pages/BorrowPage";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <header>
          <h1>Library Book Management System</h1>
          <Navigation />
        </header>
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/books" element={<BooksPage />} />
            <Route path="/borrow" element={<BorrowPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
