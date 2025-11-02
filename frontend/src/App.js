import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import BrowseMovies from './pages/BrowseMovies';
import MovieDetail from './pages/MovieDetail';
import MyReviews from './pages/MyReviews';
import CommunityReviews from './pages/CommunityReviews';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container-fluid p-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<BrowseMovies />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/my-reviews" element={<MyReviews />} />
            <Route path="/community" element={<CommunityReviews />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;