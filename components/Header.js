import { Menu } from 'antd';
import {
  AppstoreOutlined,
  CarryOutOutlined,
  CoffeeOutlined,
  LoginOutlined,
  LogoutOutlined,
  TeamOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { useEffect, useState, useContext } from 'react';
import { Context } from '../context';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import axios from 'axios';

const { Item, SubMenu, ItemGroup } = Menu;

const Header = () => {
  const [current, setCurrent] = useState('');
  const { state, dispatch } = useContext(Context);
  const { user } = state;
  const router = useRouter();

  useEffect(() => {
    process.browser && setCurrent(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  const logout = async () => {
    try {
      dispatch({ type: 'LOGOUT' });
      window.localStorage.removeItem('user');
      const response = await axios.get(`api/logout`);
      toast.dark(response.data.message);
      router.push('/login');
    } catch (error) {
      toast.dark(error?.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <Menu className='mb-2' mode='horizontal' selectedKeys={[current]}>
      <Item
        key='/'
        onClick={e => setCurrent(e.key)}
        icon={<AppstoreOutlined />}
      >
        <Link href='/'>
          <a>App</a>
        </Link>
      </Item>
      {user &&
        (user?.role && user.role.includes('Instructor') ? (
          <Item
            key='/instructor/course/create'
            onClick={e => setCurrent(e.key)}
            icon={<CarryOutOutlined />}
          >
            <Link href='/instructor/course/create'>
              <a>Create Course</a>
            </Link>
          </Item>
        ) : (
          <Item
            key='/user/become-instructor'
            className='float-right'
            onClick={e => setCurrent(e.key)}
            icon={<TeamOutlined />}
          >
            <Link href='/user/become-instructor'>
              <a>Become Instructor</a>
            </Link>
          </Item>
        ))}
      {user?.role?.includes('Instructor') && (
        <Item
          key='/instructor'
          onClick={e => setCurrent(e.key)}
          icon={<CarryOutOutlined />}
        >
          <Link href='/instructor'>
            <a>Instructor</a>
          </Link>
        </Item>
      )}
      {user === null ? (
        <>
          <Item
            key='/login'
            onClick={e => setCurrent(e.key)}
            icon={<LoginOutlined />}
          >
            <Link href='/login'>
              <a>Login</a>
            </Link>
          </Item>
          <Item
            key='/register'
            onClick={e => setCurrent(e.key)}
            icon={<UserAddOutlined />}
          >
            <Link href='/register'>
              <a>Register</a>
            </Link>
          </Item>
        </>
      ) : (
        <SubMenu
          icon={<CoffeeOutlined />}
          title={user.name}
          className='float-right'
          key='profile'
        >
          <ItemGroup>
            <Item key='user'>
              <Link href='/user'>
                <a>Dashboard</a>
              </Link>
            </Item>
            <Item key='logout' onClick={logout}>
              Logout
            </Item>
          </ItemGroup>
        </SubMenu>
      )}
    </Menu>
  );
};

export default Header;
