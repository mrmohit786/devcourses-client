import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { SyncOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { Context } from '../context';
import { useRouter } from 'next/router';

const Register = () => {
  const {
    state: { user },
  } = useContext(Context);
  const router = useRouter();

  useEffect(() => {
    if (user !== null) {
      router.push('/');
    }
  }, [user]);

  const [name, setName] = useState('Mohit');
  const [email, setEmail] = useState('patelmohit719@gmail.com');
  const [password, setPassword] = useState('Jack@123');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post(`api/register`, {
        name,
        email,
        password,
      });
      toast.dark('Registration successful, Please login');
      setName('');
      setEmail('');
      setPassword('');
      setLoading(false);
    } catch (error) {
      toast.dark(error?.response?.data?.error || 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className='jumbotron text-center bg-primary'>Register</h1>
      <div className='container col-md-4 offset-md-4 pb-5'>
        <form onSubmit={handleSubmit}>
          <input
            type='text'
            className='form-control mb-4 p-4'
            value={name}
            placeholder='Enter Name'
            required
            onChange={e => setName(e.target.value)}
            id='name'
          />
          <input
            type='email'
            className='form-control mb-4 p-4'
            value={email}
            placeholder='Enter Email'
            required
            onChange={e => setEmail(e.target.value)}
            id='email'
          />
          <input
            type='password'
            className='form-control mb-4 p-4'
            value={password}
            placeholder='Enter Password'
            required
            onChange={e => setPassword(e.target.value)}
            id='password'
          />

          <button
            className='btn btn-primary btn-block'
            type='submit'
            disabled={!name || !email || !password || loading}
          >
            {loading ? <SyncOutlined spin /> : 'Register'}
          </button>
        </form>
        <p className='text-center p-3'>
          Already registered?{' '}
          <Link href='/login'>
            <a>Login</a>
          </Link>
        </p>
      </div>
    </>
  );
};

export default Register;
