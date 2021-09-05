import { SyncOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import UserRoute from '../../../components/routes/userRoute';

const success = () => {
  const router = useRouter();
  const { id } = router.query;

  const successRequest = async () => {
    try {
      const { data } = await axios.get(`/api/stripe-success/${id}`);
      if (data && data.success) {
        router.push(`/user/course/${data.course.slug}`);
      }
    } catch (error) {
      console.log(error);
      toast.dark('Success failed');
    }
  };

  useEffect(() => {
    if (id) successRequest();
  }, [id]);

  return (
    <UserRoute showNav={false}>
      <div className="row text-center">
        <div className="col-md-9 pb-5">
          <div className="d-flex justify-content-center p-5">
            <SyncOutlined spin className="display-1 text-danger p-5" />
          </div>
        </div>
      </div>
    </UserRoute>
  );
};

export default success;
