import axios from "axios";
import { useEffect, useState } from "react";
import CourseCard from "../components/cards/CourseCard";

const Index = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const { data } = await axios.get("/api/course");
      setCourses(data);
    };
    fetchCourses();
  }, []);
  return (
    <>
      <h1 className='jumbotron text-center bg-primary square'>
        E Learning Platform
      </h1>

      <div className='container-fluid'>
        <div className='row'>
          {courses &&
            courses.map((course) => (
              <div key={course._id} className='col-md-4'>
                <CourseCard course={course} />
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default Index;
