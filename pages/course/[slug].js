import React, { useState } from "react";
import axios from "axios";
import SingleCourseJumbotron from "../../components/cards/SingleCourseJumbotron";
import PreviewModal from "../../components/modal/PreviewModal";
import SingleCourseLesson from "../../components/cards/SingleCourseLesson";

const SingleCourse = ({ course }) => {
  const [showModal, setShowModal] = useState(false);
  const [preview, setPreview] = useState("");

  return (
    <>
      <SingleCourseJumbotron
        course={course}
        setShowModal={setShowModal}
        setPreview={setPreview}
        showModal={showModal}
        preview={preview}
      />
      <PreviewModal
        setShowModal={setShowModal}
        showModal={showModal}
        preview={preview}
      />
      <SingleCourseLesson
        lessons={course.lessons}
        setPreview={setPreview}
        showModal={showModal}
        setShowModal={setShowModal}
      />
    </>
  );
};

export async function getServerSideProps({ query }) {
  const { data } = await axios.get(`${process.env.API}/course/${query.slug}`);
  return {
    props: {
      course: data,
    },
  };
}

export default SingleCourse;
