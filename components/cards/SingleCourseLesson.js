import { Avatar, List } from 'antd';
import React from 'react';

const { Item } = List;

const SingleCourseLesson = ({
  lessons,
  setPreview,
  showModal,
  setShowModal,
}) => (
  <div className="container">
    <div className="row">
      <div className="col lesson-list">
        {lessons && (
        <h4>
          {lessons.length}
          {' '}
          Lessons
        </h4>
        )}

        <hr />
        <List
          itemLayout="horizontal"
          dataSource={lessons}
          renderItem={(item, index) => (
            <Item>
              <Item.Meta
                avatar={<Avatar>{index + 1}</Avatar>}
                title={item.title}
              />
              {item.video && item.video !== null && item.free_preview && (
                <span
                  className="text-primary cursor-pointer"
                  onClick={() => {
                    setPreview(item.video.Location);
                    setShowModal(!showModal);
                  }}
                >
                  Preview
                </span>
              )}
            </Item>
          )}
        />
      </div>
    </div>
  </div>
);

export default SingleCourseLesson;
