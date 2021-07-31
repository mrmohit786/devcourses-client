import { useContext, useState } from 'react';
import { Context } from '../../context';
import { Button } from 'antd';
import axios from 'axios';
import {
  SettingOutlined,
  UserSwitchOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { toast } from 'react-toastify';
import UserRoute from '../../components/routes/userRoute';

const BecomeInstructor = () => {
  const [loading, setLoading] = useState(false);
  const {
    state: { user },
  } = useContext(Context);

  const becomeInstructor = async e => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post('/api/make-instructor');
      setLoading(false);
      window.location.href = data;
    } catch (error) {
      toast.dark('Stripe onboarding failed, try again');
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className='jumbotron text-center bg-primary'>Become Instructor</h1>

      <div className='container'>
        <div className='row'>
          <div className='col-md-6 offset-md-3 text-center'>
            <div className='pt-4'>
              <UserSwitchOutlined className='display-1 pb-3' />
              <br />
              <h2>Setup payout to publish courses to DevCourses</h2>
              <p className='lead text-warning'>
                DevCourses partners with stripe to transfer to your bank account
              </p>
              <Button
                className='mb-3'
                type='primary'
                block
                shape='round'
                icon={loading ? <LoadingOutlined /> : <SettingOutlined />}
                size='large'
                onClick={becomeInstructor}
                disabled={user?.role?.includes('Instructor') || loading}
              >
                {loading ? 'Processing...' : 'Payout setup'}
              </Button>

              <p className='lead'>
                You will be redirected to stripe to complete onboarding process
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BecomeInstructor;
