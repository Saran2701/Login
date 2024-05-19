import React, { useState } from 'react';
import { Container, TextField, Button, Box } from '@mui/material';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import Home from './Home';
import './App.css';

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleCheckUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/checkUser', {
        username,
        password,
      });
      if (response.data === "User Exists") {
        setMessage(''); // Clear any previous error messages
        onLogin(username); // Notify parent component of successful login
        navigate('/home'); // Navigate to the home page
      } else {
        setMessage(response.data);
      }
    } catch (error) {
      console.error('There was an error checking the user!', error);
      setMessage('Error checking user');
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleCheckUser}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <TextField
        label="Username"
        variant="outlined"
        fullWidth
        margin="normal"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        sx={{
          marginBottom: 2,
        }}
      />
      <TextField
        label="Password"
        type="password"
        variant="outlined"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{
          marginBottom: 2,
        }}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{
          marginTop: 2,
        }}
      >
        Check User
      </Button>
      {message && <p>{message}</p>}
    </Box>
  );
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  const handleLogin = (username) => {
    setUsername(username);
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <Routes>
        <Route path="/home" element={isLoggedIn ? <Home username={username} /> : <Navigate to="/" />} />
        <Route path="/" element={
          <Container
            maxWidth="sm"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh',
            }}
          >
            <LoginForm onLogin={handleLogin} />
          </Container>
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
