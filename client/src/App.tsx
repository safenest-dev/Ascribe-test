import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home.tsx";
import RedirectHandler from "./components/Redirect/RedirectHandler.tsx";
import NotFound from "./pages/notFound/NotFound.tsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:code" element={<RedirectHandler />} />
        <Route path="/not-found" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
