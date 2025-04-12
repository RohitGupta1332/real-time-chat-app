import styles from '../styles/lgsp.module.css'

import Input from '../components/Input';
import Button from '../components/Button';

import Loading from './Loading';

import emailIcon from '../assets/Email.svg'
import passwordIcon from '../assets/Password.svg'

import { useState } from 'react';
import { useAuthStore } from '../store/userAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Signup = () => {

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState({
        email: '',
        password: '',
        confirmPassword: '',
    });

    const signup = useAuthStore((state) => state.signup);
    const isSigningIn = useAuthStore((state) => state.isSigningIn);
    const navigate = useNavigate();

    const isStrongPassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
        return regex.test(password);
    };
      

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {
            email : '',
            password : '',
            confirmPassword : ''
        };

        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!formData.password.trim()) {
            newErrors.password = 'Password is required';
        } else if (!isStrongPassword(formData.password)) {
            newErrors.password = 'Password must be 8 digits and include uppercase, lowercase, number & special character';
        }
        if (!formData.confirmPassword.trim()) newErrors.confirmPassword = 'Confirm your password';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

        setErrors(newErrors);

        if(Object.values(newErrors).some((msg) => msg != '')) return;

        try {
            await signup({
                email : formData.email,
                password : formData.password
            }, navigate);

        } catch (err) {
            toast.error(err?.response?.data?.message || "Signup or OTP sending failed");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {isSigningIn && <Loading />}
            <div className={styles.head}>
                <h1>SIGNUP</h1>
                <p>Most powerful chatting app</p>
            </div>
            <div className={styles.inps}>
                <Input 
                type='email' 
                placeholder='Email ID' 
                icon={emailIcon}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                autoFocus
                />
                {errors.email && <p className={styles.error}>{errors.email}</p>}

                <Input 
                type='password' 
                placeholder='Create Password' 
                icon={passwordIcon}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                {errors.password && <p className={styles.error}>{errors.password}</p>}

                <Input 
                type='password' 
                placeholder='Confirm Password' 
                icon={passwordIcon}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
                {errors.confirmPassword && <p className={styles.error}>{errors.confirmPassword}</p>}
            </div>
            <Button 
            text={isSigningIn?"Signing in":"Sign up"}
            disabled={isSigningIn}
            />
        </form>
    );
};

export default Signup;