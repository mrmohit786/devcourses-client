import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import SingleCourseJumbotron from "../../components/cards/SingleCourseJumbotron";
import PreviewModal from "../../components/modal/PreviewModal";
import SingleCourseLesson from "../../components/cards/SingleCourseLesson";
import { Context } from "../../context";
import { toast } from "react-toastify";
import router from "next/router";

const SingleCourse = ({ course }) => {
  const [showModal, setShowModal] = useState(false);
  const [preview, setPreview] = useState("");
  const [enrolled, setEnrolled] = useState({});
  const [loading, setLoading] = useState(false);

  const {
    state: { user },
  } = useContext(Context);

  const handlePaidEnrollment = () => {};

  const handleFreeEnrollment = async (e) => {
    e.preventDefault();
    try {
      if (!user) {
        router.push("/login");
      }

      if (enrolled.status) {
        return router.push(`/user/course/${enrolled.course.slug}`);
      }

      setLoading(true);
      const { data } = await axios.post(`/api/free-enrollment/${course._id}`);
      toast.dark(data.message);
      return router.push(`/user/course/${data.course.slug}`);
      setLoading(false);
    } catch (error) {
      toast.dark("Enrollment failed, Try again");
      setLoading(false);
    }
  };

  const checkEnrollment = async () => {
    const { data } = await axios.get(`/api/check-enrollment/${course._id}`);
    setEnrolled(data);
  };

  useEffect(() => {
    if (user && course) {
      checkEnrollment();
    }
  }, [user, course]);

  return (
    <>
      <SingleCourseJumbotron
        course={course}
        setShowModal={setShowModal}
        setPreview={setPreview}
        showModal={showModal}
        preview={preview}
        loading={loading}
        user={user}
        handlePaidEnrollment={handlePaidEnrollment}
        handleFreeEnrollment={handleFreeEnrollment}
        enrolled={enrolled}
        setEnrolled={setEnrolled}
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
