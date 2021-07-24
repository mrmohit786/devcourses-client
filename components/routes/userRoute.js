import { SyncOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { Context } from '../../context';

const UserRoute = ({ children }) => {
  const router = useRouter();
  const [ok, setOk] = useState(false);

  const fetchUser = async () => {
    try {
      const { data } = await axios.get('/api/current-user');
      if (data.ok) {
        setOk(true);
      }
    } catch (error) {
      console.log(error);
      setOk(false);
      router.push('/login');
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      {!ok ? (
        <SyncOutlined
          spin
          className='d-flex justify-content-center display-1 text-primary p-5'
        />
      ) : (
        <>{children}</>
      )}
    </>
  );
};

export default UserRoute;
