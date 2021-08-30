import axios from "axios";
import CourseCard from "../components/cards/CourseCard";

const Index = ({ courses }) => {
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

export async function getServerSideProps() {
  const { data } = await axios.get(`${process.env.API}/course`);
  return {
    props: {
      courses: data,
    },
  };
}

export default Index;
