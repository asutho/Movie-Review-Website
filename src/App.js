import { firebaseConfig } from './config/Config';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { getFirestore } from 'firebase/firestore'
import { getStorage } from "firebase/storage"
import { useState } from 'react';
import React from 'react';
import CardList from './pages/Home';


import './App.css';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Signin } from './pages/Signin';
import { Signup } from './pages/Signup';
import { SignOut } from './pages/Signout';
import { Detail } from './pages/Detail';

// components
import { Header } from './components/Header';
import { Routes, Route } from 'react-router-dom'

//contexts
import { NavContext } from './contexts/NavContext';
import { FBAuthContext } from './contexts/FBAuthContext';
import { FBDbContext } from './contexts/FBDbContext'
import { FBStorageContext } from './contexts/FBStorageContext';

const FirebaseApp = initializeApp(firebaseConfig)
const FirebaseAuth = getAuth( FirebaseApp )
const FirebaseDB = getFirestore(FirebaseApp)
const FirebaseStorage = getStorage(FirebaseApp)

const NavRoutes = [
  { name: "Home", goto: "/" },
  { name: "About", goto: "/about" },
  { name: "Contact", goto: "/contact" },
  { name: "Sign in", goto: "/signin" },
  { name: "Sign up", goto: "/signup" },
]

const AuthNavRoutes = [
  { name: "Home", goto: "/" },
  { name: "About", goto: "/about" },
  { name: "Contact", goto: "/contact" },
  { name: "Sign out", goto: "/signout" },
  { name: "Detail", goto: "/detail"}
]


function App() {
  const [ navItems, setNavItems ] = useState( NavRoutes )
  const [ auth, setAuth ] = useState(null)

  onAuthStateChanged( FirebaseAuth, (user) => {
    if(user) {
      setAuth(user)
      setNavItems (AuthNavRoutes)
    }
    else {
      setAuth(null)
      setNavItems (NavRoutes)
    }
  })

  return (
    <div className="App">
      <NavContext.Provider value={navItems}>
        <Header/>
      </NavContext.Provider>
      
      <FBAuthContext.Provider value={FirebaseAuth}>
      <FBDbContext.Provider value={FirebaseDB}>
      <FBStorageContext.Provider value={FirebaseStorage}>
        <Routes>
          <Route path="/" element={ <Home/> } />
          <Route path="/about" element={ <About/> } />
          <Route path="/contact" element={ <Contact/> } />
          <Route path="/signin" element={ <Signin/> } />
          <Route path="/signup" element={ <Signup/> } /> 
          <Route path="/signout" element={ <SignOut/> } />  
          <Route path="/detail/:movieId" element={ <Detail/> } />       
        </Routes>
        </FBStorageContext.Provider>
      </FBDbContext.Provider>
      </FBAuthContext.Provider>
    </div>
  );

    return (
      <div className="App">
        <h1>Card Search App</h1>
        <CardList cards={cards} />
      </div>
    );
}

const cards = [
  { title: 'Card 1', content: 'Content for Card 1' },
  { title: 'Card 2', content: 'Content for Card 2' },
  // Add more cards here
];



export default App;
