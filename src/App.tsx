// Hooks
import { useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';

// Components
import Login from './components/Auth/Login/Login';
import Register from './components/Auth/Register/Register';
import Home from './components/Home/Home';

// Styles
import './App.css';


const App = () => {
	const isLoggedIn = useSelector((state: any) => state.auth.isLoggedIn);

	return (
		<div className='app'>
			<Routes>
				<Route path="/login" element={ isLoggedIn ? <Navigate to={ '/' } /> : <Login /> } />
				<Route path="/register" element={ isLoggedIn ? <Navigate to={ '/' } /> : <Register /> } />
				<Route path="/" element={ isLoggedIn ? <Home /> : <Navigate to={ '/login' } /> } />
			</Routes>
		</div>
	);
}


export default App;
