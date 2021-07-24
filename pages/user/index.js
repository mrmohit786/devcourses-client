import { useContext } from 'react';
import UserRoute from '../../components/routes/userRoute';
import { Context } from '../../context';

const UserIndex = () => {
  const {
    state: { user },
  } = useContext(Context);
  return (
    <UserRoute>
      <h1 className='jumbotron text-center bg-primary square'>Dashboard</h1>
    </UserRoute>
  );
};

export default UserIndex;
