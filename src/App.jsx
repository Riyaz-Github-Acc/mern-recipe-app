import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";
import { Auth, CreateRecipe, Home, SavedRecipes, MyRecipes } from "./pages";
import { Navbar } from "./components";

const App = () => {
  return (
    <div className="app">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/create-recipe" element={<CreateRecipe />} />
          <Route path="/my-recipes" element={<MyRecipes />} />
          <Route path="/saved-recipes" element={<SavedRecipes />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
