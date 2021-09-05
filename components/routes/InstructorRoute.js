import { SyncOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { Context } from '../../context';
import InstructorNav from '../nav/InstructorNav';

const InstructorRoute = ({ children }) => {
  const router = useRouter();
  const [ok, setOk] = useState(false);

  const fetchInstructor = async () => {
    try {
      const { data } = await axios.get('/api/current-instructor');
      if (data.ok) {
        setOk(true);
      }
    } catch (error) {
      setOk(false);
      router.push('/');
    }
  };

  useEffect(() => {
    fetchInstructor();
  }, []);

  return (
    <>
      {!ok ? (
        <SyncOutlined
          spin
          className="d-flex justify-content-center display-1 text-primary p-5"
        />
      ) : (
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-2">
              <InstructorNav />
            </div>
            <div className="col-md-10">{children}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default InstructorRoute;
