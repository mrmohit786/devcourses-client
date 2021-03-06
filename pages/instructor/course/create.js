import { useState } from 'react';
import ImageResizer from 'react-image-file-resizer';
import { toast } from 'react-toastify';
import axios from 'axios';
import { message } from 'antd';
import { useRouter } from 'next/router';
import CourseCreateForm from '../../../components/forms/CourseCreateForm';
import InstructorRoute from '../../../components/routes/InstructorRoute';

const CourseCreate = () => {
  const [values, setValues] = useState({
    name: '',
    description: '',
    price: '100.99',
    uploading: false,
    paid: false,
    loading: false,
    category: '',
  });

  const [image, setImage] = useState({});
  const [preview, setPreview] = useState('');
  const [uploadButtonText, setUploadButtonText] = useState('Upload Image');
  const router = useRouter();

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const key = 'handleImageUpload';
    setValues({ ...values, loading: true });
    ImageResizer.imageFileResizer(file, 720, 500, 'JPEG', 100, 0, async (uri) => {
      try {
        message.loading({ content: 'Uploading...', key });
        const { data } = await axios.post('/api/course/upload-image', {
          image: uri,
        });

        setImage(data);
        setPreview(window.URL.createObjectURL(file));
        setUploadButtonText(file.name);
        message.success({ content: 'Uploaded!', key, duration: 2 });
        setValues({ ...values, loading: false });
      } catch (error) {
        message.error('Image upload failed, Try later');
        setValues({ ...values, loading: false });
      }
    });
  };

  const handleImageRemove = async (e) => {
    e.preventDefault();
    const key = 'handleImageRemove';
    try {
      setValues({ ...values, loading: false });
      message.loading({ content: 'Removing...', key });
      const { data } = await axios.post('/api/course/remove-image', { image });
      setImage('');
      setPreview('');
      setUploadButtonText('Upload Image');
      setValues({ ...values, loading: false });

      message.success({ content: 'Removed!', key, duration: 2 });
    } catch (error) {
      message.error('Failed to remove image, Try again');
      setValues({ ...values, loading: false });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/course', {
        ...values,
        image,
      });
      toast.dark('Great! Now you can start adding lessons');
      router.push('/instructor');
    } catch (error) {
      toast.dark('Something went wrong, Try again');
    }
  };

  return (
    <InstructorRoute>
      <h1 className="jumbotron text-center bg-primary">Create Course</h1>
      <div className="pt-3 pb-3">
        <CourseCreateForm
          values={values}
          preview={preview}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          setValues={setValues}
          handleImageUpload={handleImageUpload}
          uploadButtonText={uploadButtonText}
          handleImageRemove={handleImageRemove}
          image={image}
        />
      </div>
    </InstructorRoute>
  );
};

export default CourseCreate;
