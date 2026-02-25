"use client"

import React, { useState, useContext } from 'react';
import { useRouter } from 'next/navigation'; 
import Link from 'next/link';
import Input from '@/components/Input';
import { validEmail } from '@/lib/helper';
import AuthLayout from "../layout";
import { API_PATH } from '@/lib/apiPath';
import instance from '@/lib/instance';
import { UserContext } from '@/context/userContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const router = useRouter();    
    const {updateUser} = useContext(UserContext);
    
    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); 

        if (!email || !password) {
            setError('Please enter all fields');
            return;
        }
        if (!validEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }
        try{
            const response = await instance.post(API_PATH.AUTH.LOGIN, { email, password });
            const {user,accessToken} = response.data.data;
            if(accessToken){
                localStorage.setItem("token",accessToken);
                updateUser(user);
                router.push("/"); // SỬA navigate thành router.push
            }
        }catch(error){
            if(error.response && error.response.data){
                setError("Email or password is incorrect");
            }else{
                setError('Try again');
            }
        }
    };

    return (
        <AuthLayout>
            {/* Nội dung UI giữ nguyên không cần sửa */}
            <div className="w-full pt-8 flex justify-center">
              <div className="w-[60%] flex flex-col justify-center items-center bg-blue-50 rounded-2xl p-8 shadow-blue-200 shadow-lg">
                <h3 className="text-2xl font-semibold text-black mb-4">Welcome</h3>
                
                <form onSubmit={handleLogin} className="w-full max-w-sm flex flex-col">
                    <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@email.com" type="email" label="Email Address"/>
                    <Input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" type="password" label="Password"/>

                    {error && <p className="text-red-500 text-center text-sm">{error}</p>}

                    <div className="pt-2">
                      <button type="submit" className="w-full bg-blue-500 text-white px-5 py-2 rounded hover:bg-blue-600 transition-colors">
                          Login
                      </button>
                    </div>
                </form>

                <Link href="/signup" className="text-blue-600 hover:underline mt-4 pt-1">
                    Don't have an account?
                </Link> 
            </div>
          </div>
        </AuthLayout>
    );
};

export default Login;