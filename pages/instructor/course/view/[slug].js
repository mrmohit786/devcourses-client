import { CheckOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import { Avatar, Button, Tooltip, Modal, List } from 'antd';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import InstructorRoute from '../../../../components/routes/InstructorRoute';
import ReactMarkdown from 'react-markdown';
import AddLessonForm from '../../../../components/forms/AddLessonForm';
import Item from 'antd/lib/list/Item';

const CourseView = () => {
  const [course, setCourse] = useState({});
  const [visible, setVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [savingLesson, setSavingLesson] = useState(false);
  const [videoRemoving, setVideoRemoving] = useState(false);

  const [progress, setProgress] = useState(0);
  const [uploadButtonText, setUploadButtonText] = useState('Upload Video');
  const [values, setValues] = useState({
    title: '',
    content: '',
    video: {},
  });
  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    if (slug) {
      loadCourse();
    }
  }, [slug]);

  const loadCourse = async () => {
    try {
      const { data } = await axios.get(`/api/course/${slug}`);
      setCourse(data);
    } catch (error) {
      toast.dark('Problem in fetching course');
    }
  };

  const handleVideoUpload = async e => {
    let file = e.target.files[0];
    try {
      setUploading(true);
      const videoData = new FormData();
      videoData.append('video', file);

      const { data } = await axios.post(
        `/api/course/upload-video/${course.instructor._id}`,
        videoData,
        {
          onUploadProgress: e => {
            setProgress(Math.round((100 * e.loaded) / e.total));
          },
        }
      );
      setUploadButtonText(file.name);
      setValues({ ...values, video: data });
      setUploading(false);
    } catch (error) {
      setUploading(false);
      setProgress(0);
      toast.error('Video upload failed');
    }
  };

  const handleVideoRemove = async () => {
    try {
      setVideoRemoving(true);
      const { data } = await axios.post(
        `/api/course/remove-video${course.instructor._id}`,
        {
          video: values.video,
        }
      );
      setValues({ ...values, video: {} });
      setProgress(0);
      setVideoRemoving(false);
      setUploadButtonText('Upload Video');
    } catch (error) {
      setVideoRemoving(false);
      setProgress(0);
      toast.dark('Video remove failed');
    }
  };

  const handleAddLesson = async e => {
    e.preventDefault();
    try {
      setSavingLesson(true);
      const { data } = await axios.post(
        `/api/course/lesson/${slug}/${course.instructor._id}`,
        values
      );
      setValues({ ...values, title: '', content: '', video: {} });
      setVisible(false);
      setSavingLesson(false);
      setUploadButtonText('Upload video');
      setCourse(data);
      toast.dark('Lesson added');
    } catch (error) {
      setSavingLesson(false);
      toast.dark('Lesson add failed, Try again');
    }
  };

  return (
    <InstructorRoute>
      <div className='container-fluid pt-3'>
        {course && (
          <div className='container-fluid pt-1'>
            <div className='media pt-2'>
              <Avatar
                size={80}
                src={
                  course.image
                    ? course.image.Location
                    : '/no-image-available.png'
                }
              />

              <div className='media-body pl-2'>
                <div className='row'>
                  <div className='col'>
                    <h5 className='mt-2 text-primary'>{course.name}</h5>
                    <p style={{ marginTop: '-10px' }}>
                      {course.lessons && course.lessons.length} Lessons
                    </p>
                    <p style={{ marginTop: '-15px', fontSize: '10px' }}>
                      {course.category}
                    </p>
                  </div>
                  <div className='d-flex pt-4'>
                    <Tooltip title='Edit'>
                      <EditOutlined
                        onClick={() =>
                          router.push(`/instructor/course/edit/${slug}`)
                        }
                        className='h5 cursor-pointer text-warning mr-4'
                      />
                    </Tooltip>
                    <Tooltip
                      title='Publish'
                      className='h5 cursor-pointer text-danger'
                    >
                      <CheckOutlined />
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>
            <hr />
            <div className='row'>
              <div className='col'>
                <ReactMarkdown>{course.description}</ReactMarkdown>
              </div>
            </div>
            <div className='row'>
              <Button
                onClick={() => setVisible(true)}
                className='col-md-6 offset-md-3 text-center'
                type='primary'
                shape='round'
                icon={<UploadOutlined />}
                size='large'
              >
                Add Lesson
              </Button>
            </div>
            <br />
            <Modal
              title='+ Add Lesson'
              centered
              visible={visible}
              onCancel={() => setVisible(false)}
              footer={null}
            >
              <AddLessonForm
                setValues={setValues}
                values={values}
                handleAddLesson={handleAddLesson}
                uploading={uploading}
                uploadButtonText={uploadButtonText}
                handleVideoUpload={handleVideoUpload}
                progress={progress}
                handleVideoRemove={handleVideoRemove}
                videoRemoving={videoRemoving}
                savingLesson={savingLesson}
              />
            </Modal>
            <div className='row pb-5'>
              <div className='col lesson-list'>
                <h4>
                  {course && course.lessons && course.lessons.length} Lessons
                </h4>
                <List
                  itemLayout='horizontal'
                  dataSource={course && course.lessons}
                  renderItem={(item, index) => (
                    <Item>
                      <Item.Meta
                        avatar={<Avatar>{index + 1}</Avatar>}
                        title={item.title}
                      ></Item.Meta>
                    </Item>
                  )}
                ></List>
              </div>
            </div>
          </div>
        )}
      </div>
    </InstructorRoute>
  );
};

export default CourseView;
