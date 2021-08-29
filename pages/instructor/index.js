import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import InstructorRoute from '../../components/routes/InstructorRoute';
import { Avatar } from 'antd';
import Link from 'next/link';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const InstructorIndex = () => {
  const [courses, setCourses] = useState([]);
  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const { data } = await axios.get('/api/instructor-courses');
      setCourses(data);
    } catch (error) {
      toast.dark('Problem in fetching courses');
    }
  };

  const myStyle = { marginTop: '-15px', fontSize: '10px' };
  return (
    <InstructorRoute>
      <h1 className='jumbotron text-center bg-primary'>Instructor Dashboard</h1>
      {courses &&
        courses?.map(course => (
          <>
            <div className='media pt-2'>
              <Avatar
                size={80}
                src={course.image ? course.image.Location : '/no-image-available.png'}
              />
              <div className='media-body pl-2'>
                <div className='row'>
                  <div className='col'>
                    <Link
                      className='cursor-pointer'
                      href={`/instructor/course/view/${course.slug}`}
                    >
                      <a className='mt-2'>
                        <h5 className='pt-2 text-primary'>{course.name}</h5>
                      </a>
                    </Link>
                    <p style={{ marginTop: '-10px' }}>
                      {course.lessons.length} Lessons
                    </p>

                    {course.lessons.length < 5 ? (
                      <p style={myStyle} className='text-warning'>
                        At least 5 lessons are required to publish a course
                      </p>
                    ) : course.published ? (
                      <p style={myStyle} className='text-success'>
                        Your course is live in marketplace
                      </p>
                    ) : (
                      <p style={myStyle} className='text-success'>
                        Your course is ready to be publish
                      </p>
                    )}
                  </div>
                  <div className='col-md-3 mt-3 text-center'>
                    {course.published ? (
                      <div>
                        <CheckCircleOutlined className='h5 pointer text-success' />
                      </div>
                    ) : (
                      <div>
                        <CloseCircleOutlined className='h5 pointer text-warning' />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        ))}
    </InstructorRoute>
  );
};

export default InstructorIndex;
