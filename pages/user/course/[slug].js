import { Menu, Avatar, Button } from 'antd';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState, createElement } from 'react';
import { toast } from 'react-toastify';
import ReactPlayer from 'react-player';
import ReactMarkdown from 'react-markdown';
import {
  CheckCircleFilled,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MinusCircleFilled,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { isEmpty } from 'lodash';
import StudentRoute from '../../../components/routes/StudentRoute';

const { Item } = Menu;

const ViewCourse = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [clicked, setClicked] = useState(-1);
  const [course, setCourse] = useState({ lessons: [] });
  const [completedLessons, setCompletedLessons] = useState([]);

  const loadCourse = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/user/course/${slug}`);
      if (data) {
        setCourse(data);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      router.push();
      toast.dark('failed to fetch course');
    }
  };

  const markCompleted = async () => {
    try {
      const { data } = await axios.post('/api/mark-complete', {
        courseId: course._id,
        lessonId: course.lessons[clicked]._id,
      });
      if (data.ok) {
        loadCompletedLessons();
      }
    } catch (error) {
      toast.dark('Failed to mark as complete, try again');
    }
  };

  const markIncompleted = async () => {
    try {
      const { data } = await axios.post('/api/mark-incomplete', {
        courseId: course._id,
        lessonId: course.lessons[clicked]._id,
      });
      if (data.ok) {
        loadCompletedLessons();
      }
    } catch (error) {
      toast.dark('Failed to mark as incomplete, try again');
    }
  };

  const loadCompletedLessons = async () => {
    try {
      const { data } = await axios.post('/api/list-complete', {
        courseId: course._id,
      });
      if (!isEmpty(data)) {
        setCompletedLessons(data);
      }
    } catch (error) {
      toast.dark('Failed to load completed lessons');
    }
  };

  useEffect(() => {
    if (!isEmpty(slug)) {
      loadCourse();
    }
  }, [slug]);

  useEffect(() => {
    if (!isEmpty(course._id)) {
      loadCompletedLessons();
    }
  }, [course]);

  return (
    <StudentRoute>
      <div className="row">
        <div style={{ maxWidth: 320 }}>
          <Button
            onClick={() => setCollapsed(!collapsed)}
            className="text-primary mt-1 btn-block mb-2"
          >
            {createElement(collapsed ? MenuFoldOutlined : MenuUnfoldOutlined)}
            {' '}
            {!collapsed && 'Lessons'}
          </Button>
          <Menu
            inlineCollapsed={collapsed}
            mode="inline"
            style={{ height: '80vh', overflow: 'hidden' }}
          >
            {course.lessons.map((lesson, index) => (
              <Item
                key={index}
                icon={<Avatar>{index + 1}</Avatar>}
                onClick={() => setClicked(index)}
              >
                {lesson.title.substring(0, 30)}
                {' '}
                {completedLessons.includes(lesson._id) ? (
                  <CheckCircleFilled
                    className="float-right text-primary ml-2"
                    style={{ marginTop: '13px' }}
                  />
                ) : (
                  <MinusCircleFilled
                    className="float-right text-danger ml-2"
                    style={{ marginTop: '13px' }}
                  />
                )}
              </Item>
            ))}
          </Menu>
        </div>
        <div className="col">
          {clicked !== -1 ? (
            <>
              <div className="col alert alert-primary square">
                <b>{course.lessons[clicked].title.substring(0, 30)}</b>
                {completedLessons.includes(course.lessons[clicked]._id) ? (
                  <span
                    className="cursor-pointer float-right"
                    onClick={markIncompleted}
                  >
                    Mark as Incomplete
                  </span>
                ) : (
                  <span
                    className="cursor-pointer float-right"
                    onClick={markCompleted}
                  >
                    Mark as complete
                  </span>
                )}
              </div>
              {course.lessons[clicked].video
                && course.lessons[clicked].video.Location && (
                  <>
                    <div className="wrapper">
                      <ReactPlayer
                        className="player"
                        url={course.lessons[clicked].video.Location}
                        width="100%"
                        height="100%"
                        controls
                        onEnded={markCompleted}
                      />
                    </div>
                  </>
              )}

              <ReactMarkdown className="single-post">
                {course.lessons[clicked].content}
              </ReactMarkdown>
            </>
          ) : (
            <div className="d-flex justify-content-center p-5">
              <div className="text-center p-5">
                <PlayCircleOutlined className="text-primary display-1 p-5" />
                <p className="lead">Click on the lessons to start learning</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </StudentRoute>
  );
};

export default ViewCourse;
