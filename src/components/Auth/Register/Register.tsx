// Hooks
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Utils
import axios from '../../../utils/axiosPrivate';

// Styles
import './Register.css';


const Register = () => {
    const navigate = useNavigate();

    const [ username, setUsername ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleFormSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        setErrors({});

        const newErrors: { [key: string]: string } = {};

        if (username === "") {
            newErrors.username = "Username is required";
        }

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
            const res = await axios.post('/auth/register', {
                username,
                email,
                password
            });
    
            navigate('/');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="register-form">
            <div className="register-title">
                Register
            </div>
            <form onSubmit={handleFormSubmit}>
                <input value={ username } type="text" placeholder="Username" onChange={(e) => {
                    setUsername(e.target.value);
                    setErrors((prev) => ({ ...prev, username: "" }));
                }} />
                {errors.username && <div className="error-message">{errors.username}</div>}
                <input value={ email } type="text" placeholder="Email" onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((prev) => ({ ...prev, email: "" }));
                }} />
                {errors.email && <div className="error-message">{errors.email}</div>}
                <input value={ password } type="password" placeholder="Password" onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, password: "" }));
                }} />
                {errors.password && <div className="error-message">{errors.password}</div>}
                <button type="submit">Register</button>
            </form>
            <div>
                <Link to={ '/login' } className="alternative-link">
                    Already have an account? Login instead.
                </Link>
            </div>
        </div>
    );
};


export default Register;