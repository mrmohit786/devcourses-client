import { PlayCircleOutlined, SyncOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import axios from "axios";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import UserRoute from "../../components/routes/userRoute";
import { Context } from "../../context";

const UserIndex = () => {
  const {
    state: { user },
  } = useContext(Context);

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/user-courses");
      if (data) {
        setCourses(data);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      toast.dark("failed to fetch user courses");
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  return (
    <UserRoute>
      {loading && (
        <SyncOutlined
          spin
          className='d-flex justify-content-center display-1 text-danger p-5'
        />
      )}
      <h1 className='jumbotron text-center bg-primary square'>Dashboard</h1>
      {courses &&
        courses.map((course) => (
          <div key={course._id} className='media pt-2 pb-1'>
            <Avatar
              size={80}
              shape='square'
              src={course.image ? course.image.Location : "/course.pmg"}
            />
            <div className='media-body pl-1'>
              <div className='row'>
                <div className='col'>
                  <Link
                    href={`/user/course/${course.slug}`}
                    className='cursor-pointer'
                  >
                    <a>
                      <h5 className='mt-2 text-primary'>{course.name}</h5>
                    </a>
                  </Link>
                  <p style={{ marginTop: "-10px" }}>{course.lessons.length}</p>
                  <p
                    className='text-muted'
                    style={{ marginTop: "-15px", fontSize: "12px" }}
                  >
                    By {course.instructor.name}
                  </p>
                </div>
                <div className='col-md-3 mt-3 text-center'>
                  <Link href={`user/course/${course.slug}`}>
                    <a>
                      <PlayCircleOutlined className='h2 cursor-pointer text-primary' />
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
    </UserRoute>
  );
};

export default UserIndex;
