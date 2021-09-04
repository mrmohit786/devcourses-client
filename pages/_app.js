// Runs this page before rendering other component
import Header from '../components/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/antd.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../public/css/styles.css';
import { Provider } from '../context';

const App = ({ Component, pageProps }) => {
  return (
    <Provider>
      <ToastContainer position='top-center' />
      <Header />
      <Component {...pageProps} />
    </Provider>
  );
};

export default App;
