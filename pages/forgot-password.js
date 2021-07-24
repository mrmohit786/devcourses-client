import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import { SyncOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { Context } from '../context';
import { useRouter } from 'next/router';

const ForgotPassword = () => {
  const {
    state: { user },
  } = useContext(Context);
  const router = useRouter();

  useEffect(() => {
    if (user !== null) {
      router.push('/');
    }
  }, [user]);

  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post('/api/forgot-password', { email });
      setSuccess(true);
      toast.dark('Check your email for secret code');
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.dark(error?.response?.data?.error || 'Something went wrong');
    }
  };

  const handleResetPassword = async e => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post('/api/reset-password', { email, code, newPassword });
      toast.dark('Reset successfully, Please login with new password');
      setEmail('');
      setCode('');
      setNewPassword('');
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.dark(error?.response?.data?.error || 'Something went wrong');
    }
  };
  return (
    <>
      <h1 className='jumbotron text-center bg-primary square'>
        Forgot Password
      </h1>
      <div className='container col-md-4 offset-md-4 pb-5'>
        <form onSubmit={success ? handleResetPassword : handleSubmit}>
          <input
            type='email'
            className='form-control mb-4 p-4'
            value={email}
            placeholder='Enter Email'
            required
            disabled={success && email}
            onChange={e => setEmail(e.target.value)}
            id='email'
          />
          {success && (
            <>
              <input
                type='text'
                className='form-control mb-4 p-4'
                value={code}
                placeholder='Enter secret code'
                required
                onChange={e => setCode(e.target.value)}
                id='code'
              />
              <input
                type='password'
                className='form-control mb-4 p-4'
                value={newPassword}
                placeholder='Enter new password'
                required
                onChange={e => setNewPassword(e.target.value)}
                id='password'
              />
            </>
          )}
          <button
            disabled={loading || !email}
            type='submit'
            className='btn btn-block btn-primary p-2'
          >
            {loading ? <SyncOutlined spin /> : 'Submit'}
          </button>
        </form>
      </div>
    </>
  );
};

export default ForgotPassword;
