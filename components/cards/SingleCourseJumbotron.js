import { Badge, Button } from 'antd';
import ReactPlayer from 'react-player';
import { LoadingOutlined, SafetyOutlined } from '@ant-design/icons';
import { currencyFormatter } from '../../utils/helper';

const SingleCourseJumbotron = ({
  course,
  setShowModal,
  setPreview,
  showModal,
  preview,
  loading,
  user,
  handlePaidEnrollment,
  handleFreeEnrollment,
  enrolled,
}) => {
  const {
    name,
    instructor,
    price,
    image,
    paid,
    category,
    updatedAt,
    description,
    lessons,
  } = course;
  return (
    <div className="jumbotron bg-primary square">
      <div className="row">
        <div className="col-md-8">
          <h1 className="text-light font-weight-bold">{name}</h1>
          <p className="lead">
            {description && description.substring(0, 160)}
            ...
          </p>
          <Badge
            count={category}
            style={{ backgroundColor: '#03a9f4' }}
            className="pb-2 mr-2"
          />
          <p>
            Created by
            {instructor.name}
          </p>
          <p>
            Last updated
            {new Date(updatedAt).toLocaleDateString()}
          </p>
          <h4 className="text-light">
            {paid
              ? currencyFormatter({ amount: price, currency: 'usd' })
              : 'Free'}
          </h4>
        </div>

        <div className="col-md-4">
          {lessons[0].video && lessons[0].video.Location ? (
            <div
              className=""
              onClick={() => {
                setPreview(lessons[0].video.Location);
                setShowModal(!showModal);
              }}
            >
              <ReactPlayer
                className="react-player-div"
                light={image.Location}
                url={lessons[0].video.Location}
                width="100%"
                height="225px"
              />
            </div>
          ) : (
            <>
              <img src={image.Location} alt={name} className="img img-fluid" />
            </>
          )}
          <Button
            className="mb-3 mt-3"
            type="danger"
            block
            size="large"
            shape="round"
            icon={<SafetyOutlined />}
            disabled={loading}
            loading={loading}
            onClick={paid ? handlePaidEnrollment : handleFreeEnrollment}
          >
            {user
              ? enrolled.status
                ? 'Go to course'
                : 'Enroll'
              : 'Login to enroll'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SingleCourseJumbotron;
