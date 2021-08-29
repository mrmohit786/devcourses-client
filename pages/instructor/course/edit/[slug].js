import { useEffect, useState } from "react";
import InstructorRoute from "../../../../components/routes/InstructorRoute";
import CourseCreateForm from "../../../../components/forms/CourseCreateForm";
import ImageResizer from "react-image-file-resizer";
import { toast } from "react-toastify";
import axios from "axios";
import { message, List, Avatar, Modal } from "antd";
import { useRouter } from "next/router";
import { DeleteOutlined } from "@ant-design/icons";
import UpdateLessonForm from "../../../../components/forms/UpdateLessonForm";
const { Item } = List;

const CourseEdit = () => {
  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "100",
    uploading: false,
    paid: false,
    loading: false,
    category: "",
    lessons: [],
  });

  const [image, setImage] = useState({});
  const [preview, setPreview] = useState("");
  const [uploadButtonText, setUploadButtonText] = useState("Upload Image");

  const router = useRouter();
  const { slug } = router.query;

  // state for lessons update
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState({});
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadVideoButtonText, setUploadVideoButtonText] =
    useState("Upload Video");

  useEffect(() => {
    if (slug) {
      loadCourse();
    }
  }, [slug]);

  const loadCourse = async () => {
    try {
      const { data } = await axios.get(`/api/course/${slug}`);
      setValues({
        ...values,
        ...data,
      });
      setImage(data.image || {});
    } catch (error) {
      toast.dark("Problem in fetching course");
    }
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const key = "handleImageUpload";
    setValues({ ...values, loading: true });
    ImageResizer.imageFileResizer(
      file,
      720,
      500,
      "JPEG",
      100,
      0,
      async (uri) => {
        try {
          message.loading({ content: "Uploading...", key });
          const { data } = await axios.post("/api/course/upload-image", {
            image: uri,
          });

          setImage(data);
          setPreview(window.URL.createObjectURL(file));
          setUploadButtonText(file.name);
          message.success({ content: "Uploaded!", key, duration: 2 });
          setValues({ ...values, loading: false });
        } catch (error) {
          message.error("Image upload failed, Try later");
          setValues({ ...values, loading: false });
        }
      }
    );
  };

  const handleImageRemove = async (e) => {
    e.preventDefault();
    const key = "handleImageRemove";
    try {
      setValues({ ...values, loading: false });
      message.loading({ content: "Removing...", key });
      const { data } = await axios.post("/api/course/remove-image", { image });
      setImage("");
      setPreview("");
      setUploadButtonText("Upload Image");
      setValues({ ...values, loading: false });

      message.success({ content: "Removed!", key, duration: 2 });
    } catch (error) {
      message.error("Failed to remove image, Try again");
      setValues({ ...values, loading: false });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(`/api/course/${slug}`, {
        ...values,
        image,
      });
      toast.dark("Course updated");
    } catch (error) {
      toast.dark("Something went wrong, Try again");
    }
  };

  const handleDrag = (e, index) => {
    e.dataTransfer.setData("itemIndex", index);
  };

  const handleDrop = async (e, index) => {
    const movingItemIndex = e.dataTransfer.getData("itemIndex");
    const targetItemIndex = index;
    let allLessons = values.lessons;

    let movingItem = allLessons[movingItemIndex];
    allLessons.splice(movingItemIndex, 1);
    allLessons.splice(targetItemIndex, 0, movingItem);

    setValues({ ...values, lessons: allLessons });

    const { data } = await axios
      .put(`/api/course/${slug}`, {
        ...values,
        image,
      })
      .catch(() => toast.dark("Rearrange failed"));

    if (data && data._id) {
      toast.dark("Lesson rearranged");
    }
  };

  const handleDelete = async (index, item) => {
    const answer = window.confirm("Are you sure you want to delete?");
    if (!answer) {
      return;
    }

    let allLessons = values.lessons;
    const removed = allLessons.splice(index, 1);
    setValues({ ...values, lessons: allLessons });

    const { data } = await axios
      .put(`/api/course/${slug}/${removed[0]._id}`)
      .catch(() => toast.dark("Delete failed"));

    if (data && data._id) {
      toast.dark("Lesson deleted");
    }
  };

  /**
   * lesson update function
   */

  const handleVideo = async (e) => {
    if (current.video && current.video.Location) {
      const res = await axios.post(
        `/api/course/remove-video/${values.instructor._id}`,
        {
          video: current.video,
        }
      );
    }

    const file = e.target.files[0];
    setUploadVideoButtonText(file.name);
    setUploading(true);

    const videoData = new FormData();
    videoData.append("video", file);
    videoData.append("courseId", values._id);

    const { data } = await axios
      .post(`/api/course/upload-video/${values.instructor._id}`, videoData, {
        onUploadProgress: (e) =>
          setProgress(Math.round((100 * e.loaded) / e.total)),
      })
      .catch(() => {
        toast.dark("Video upload failed");
        setUploading(false);
      });

    setCurrent({ ...current, video: data });
    setUploading(false);
  };

  const handleUpdateLesson = async (e) => {
    e.preventDefault();
    const { data } = await axios
      .put(`/api/course/lesson/${slug}`, current)
      .catch(() => {
        toast.dark("Lesson update failed");
      });

    setProgress(0);
    setUploadVideoButtonText("Upload Video");
    setVisible(false);

    if (data.ok) {
      let arr = values.lessons;
      const index = arr.findIndex((el) => el._id === current._id);
      arr[index] = current;
      setValues({ ...values, lessons: arr });
      toast.dark("Lesson updated");
    }
  };

  return (
    <InstructorRoute>
      <h1 className='jumbotron text-center bg-primary'>Update Course</h1>
      <div className='pt-3 pb-3'>
        <CourseCreateForm
          values={values}
          preview={preview}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          setValues={setValues}
          handleImageUpload={handleImageUpload}
          uploadButtonText={uploadButtonText}
          handleImageRemove={handleImageRemove}
          edit
        />
      </div>
      <hr />
      <div className='row pb-5'>
        <div className='col lesson-list'>
          <h4>{values && values.lessons && values.lessons.length} Lessons</h4>
          <List
            onDragOver={(e) => e.preventDefault()}
            itemLayout='horizontal'
            dataSource={values && values.lessons}
            renderItem={(item, index) => (
              <Item
                draggable
                onDragStart={(e) => handleDrag(e, index)}
                onDrop={(e) => handleDrop(e, index)}
              >
                <Item.Meta
                  onClick={() => {
                    setVisible(true);
                    setCurrent(item);
                  }}
                  avatar={<Avatar>{index + 1}</Avatar>}
                  title={item.title}
                ></Item.Meta>
                <DeleteOutlined
                  onClick={() => handleDelete(index, item)}
                  className='text-danger float-right'
                />
              </Item>
            )}
          ></List>
        </div>
      </div>

      <Modal
        title='Update Lesson'
        centered
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <UpdateLessonForm
          handleVideo={handleVideo}
          handleUpdateLesson={handleUpdateLesson}
          current={current}
          setCurrent={setCurrent}
          uploadVideoButtonText={uploadVideoButtonText}
          progress={progress}
          uploading={uploading}
        />
      </Modal>
    </InstructorRoute>
  );
};

export default CourseEdit;
