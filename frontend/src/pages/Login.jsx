import emailIcon from '../assets/Email.svg'
import passwordIcon from '../assets/Password.svg'

import styles from '../styles/lgsp.module.css'

import Button from '../components/Button';
import Input from '../components/Input';

import Loading from './Loading';

import { useState } from 'react';
import { useAuthStore } from '../store/userAuth';
import { useNavigate } from 'react-router-dom';

const Login = () => {

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({ email: '', password: '' });

    const login = useAuthStore((state) => state.login);
    const isLoggingIn = useAuthStore((state) => state.isLoggingIn);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        let newErrors = { email: '', password: '' };
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!formData.password.trim()) newErrors.password = 'Password is required';
    
        setErrors(newErrors);
    
        if (newErrors.email || newErrors.password) return;
    
        try {
            await login(formData, navigate);
        } catch (err) {
            // toast.error(err.message || "Login failed");
            alert(err.message || "Login failed");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {isLoggingIn && <Loading />}
            <div className={styles.head}>
                <h1>LOGIN</h1>
                <p>Most powerful chatting app</p>
            </div>
            <div className={styles.inps}>
                <Input 
                type='email' 
                placeholder='Email ID' 
                icon={emailIcon} 
                value={formData.email}
                onChange={(e) =>
                    setFormData({...formData, email: e.target.value})
                }
                autoFocus 
                />
                {errors.email && <p className={styles.error}>{errors.email}</p>}

                <Input 
                type='password' 
                placeholder='Password' 
                icon={passwordIcon}
                value={formData.password}
                onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                }/>
                {errors.password && <p className={styles.error}>{errors.password}</p>}
            </div>
            <Button 
            text={isLoggingIn ? 'Logging in...' : 'Login now'}
            disabled={isLoggingIn}
            />
        </form>
    );
};

export default Login;