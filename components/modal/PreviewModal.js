import { Modal } from 'antd';
import React from 'react';
import ReactPlayer from 'react-player';

const PreviewModal = ({ showModal, setShowModal, preview }) => (
  <Modal
    title="Course Preview"
    visible={showModal}
    onCancel={() => setShowModal(!showModal)}
    width={720}
    footer={null}
  >
    <div className="wrapper">
      <ReactPlayer
        url={preview}
        playing={showModal}
        controls
        width="100%"
        height="100%"
      />
    </div>
  </Modal>
);

export default PreviewModal;
