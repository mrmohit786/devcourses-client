import { CloudSyncOutlined } from "@ant-design/icons";
import UserRoute from "../../components/routes/userRoute";

const StripeCancel = () => {
  return (
    <UserRoute showNav={false}>
      <div className='row text-center'>
        <div className='col'>
          <CloudSyncOutlined className='display-1 text-danger p-5' />
          <p className='lead'>Payment failed, try again.</p>
        </div>
      </div>
    </UserRoute>
  );
};

export default StripeCancel;
