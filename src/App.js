import React from 'react';
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
import Nav from './components/Nav';
import Banner from './components/Banner';
import Login from './components/Login';
import Register from './components/Register';
import UserProfile from './components/UserProfile';
import ChatBot from './components/Chatbot';
import BlueprintPage from './components/BlueprintPage';
import Result from './components/Result'
import UserDesigns from './components/UserDesign'
import ImageUpload from './components/ImageUpload';
import EstimatePage from './components/EstimatePage';
import { ThemeProvider } from './components/contexts/ThemeContext';
import { LanguageProvider } from './components/contexts/LanguageContext';



const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Nav />
      <Outlet />
    </div>
  );
}

const Home = () => {
  return (
    <>
      <Banner />
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Router>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/user/:id" element={<UserProfile />} />
              <Route path="/user/:id/designs" element={<UserDesigns />} />
              <Route path="/chat/:id" element={<ChatBot />} />
              <Route path="/BlueprintPage/" element={<BlueprintPage />} />
              <Route path="/Result" element={<Result />} />
              <Route path="/image/:id" element={<ImageUpload />} />
              <Route path="/estimates/:estimateIdx" element={<EstimatePage/>}/> 
            </Route>
          </Routes>
        </Router>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;