// Hooks
import { useState } from "react";
import { useDispatch } from "react-redux";

// Utils
import axios from '../../../utils/axiosPrivate';

// Store Actions
import { authActions } from "../../../store";

// Styles
import './Login.css';
import { Link, useNavigate } from "react-router-dom";


const Login = () => {
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleFormSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        setErrors({});

        const newErrors: { [key: string]: string } = {};

        if (email === "") {
            newErrors.email = "Email is required";
        } else if (!validateEmail(email)) {
            newErrors.email = "Email is not valid";
        }

        if (!password) {
            newErrors.password = "Password is required";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const res = await axios.post('/auth/login', {
                email,
                password
            });

            dispatch(authActions.changeIsLoggedIn(true));
            dispatch(authActions.changeLoggedInUser({
                userId: res.data.id,
                username: res.data.username,
                email: res.data.email,
                accessToken: res.data.accessToken,
                allPosts: res.data.allPosts,
            }));
    
            navigate('/');
        } catch (error: any) {
            if (error.response.status === 401 && error.response.data.emailNonExistent) {
                setErrors((prev) => ({ ...prev, email: error.response.data.emailNonExistent }));
            }
            if (error.response.status === 401 && error.response.data.incorrectPassword) {
                setErrors((prev) => ({ ...prev, password: error.response.data.incorrectPassword }));
            }
        }
    };

    return (
        <div className="login-form">
            <div className="login-title">
                Login
            </div>
            <form onSubmit={handleFormSubmit}>
                <input value={ email } type="text" placeholder="Email" onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((prev) => ({ ...prev, email: "" }))
                }} />
                {errors.email && <div className="error-message">{errors.email}</div>}
                <input value={ password } type="password" placeholder="Password" onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, password: "" }));
                }} />
                {errors.password && <div className="error-message">{errors.password}</div>}
                <button type="submit">Login</button>
            </form>
            <div>
                <Link className="alternative-link" to={ '/register' }>
                    Don't have an account? Register instead.
                </Link>
            </div>
        </div>
    );
};


export default Login;