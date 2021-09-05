import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { SyncOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Context } from '../context';

const Login = () => {
  const {
    state: { user },
    dispatch,
  } = useContext(Context);
  const router = useRouter();
  const [email, setEmail] = useState('patelmohit719@gmail.com');
  const [password, setPassword] = useState('Jack@123');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user !== null) {
      router.push('/');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post('api/login', {
        email,
        password,
      });
      setEmail('');
      setPassword('');
      dispatch({ type: 'LOGIN', payload: response.data });
      window.localStorage.setItem('user', JSON.stringify(response.data));
      toast.dark('Login successfully');
      router.push('/user');
      setLoading(false);
    } catch (error) {
      toast.dark(error?.response?.data?.error || 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="jumbotron text-center bg-primary">Login</h1>
      <div className="container col-md-4 offset-md-4 pb-5">
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="form-control mb-4 p-4"
            value={email}
            placeholder="Enter Email"
            required
            onChange={(e) => setEmail(e.target.value)}
            id="email"
          />
          <input
            type="password"
            className="form-control mb-4 p-4"
            value={password}
            placeholder="Enter Password"
            required
            onChange={(e) => setPassword(e.target.value)}
            id="password"
          />
          <button
            className="btn btn-primary btn-block"
            type="submit"
            disabled={!email || !password || loading}
          >
            {loading ? <SyncOutlined spin /> : 'Login'}
          </button>
        </form>
        <p className="text-center p-3">
          Not yet registered?
          {' '}
          <Link href="/register">
            <a>Register</a>
          </Link>
        </p>
        <p className="text-center">
          Forgot password?
          {' '}
          <Link href="/forgot-password">
            <a className="text-danger">Reset here</a>
          </Link>
        </p>
      </div>
    </>
  );
};

export default Login;
