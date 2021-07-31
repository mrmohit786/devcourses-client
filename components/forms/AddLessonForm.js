import { CloseCircleFilled } from '@ant-design/icons';
import { Button, Progress, Tooltip } from 'antd';
import { isEmpty } from 'lodash';

const AddLessonForm = ({
  handleAddLesson,
  values,
  setValues,
  uploading,
  uploadButtonText,
  handleVideoUpload,
  progress,
  handleVideoRemove,
  videoRemoving,
  savingLesson,
}) => {
  return (
    <div className='container pt-3'>
      <form onSubmit={handleAddLesson}>
        <input
          type='text'
          name='title'
          className='form-control square'
          onChange={e => setValues({ ...values, title: e.target.value })}
          placeholder='Title'
          value={values.title}
          autoFocus
          required
        />
        <textarea
          name='content'
          cols='7'
          rows='3'
          className='form-control mt-3'
          onChange={e => setValues({ ...values, content: e.target.value })}
          value={values.content}
        ></textarea>
        <div className='d-flex justify-content-center'>
          <label className='btn btn-dark btn-block text-left mt-3'>
            {uploadButtonText}
            <input
              onChange={handleVideoUpload}
              type='file'
              accept='video/*'
              hidden
            />
          </label>
          {!uploading && values.video.Location && (
            <Tooltip title='Remove'>
              <span className='pt-1 pl-3' onClick={handleVideoRemove}>
                <CloseCircleFilled className='text-danger d-flex justify-content-center pt-3 cursor-pointer' />
              </span>
            </Tooltip>
          )}
        </div>
        {progress > 0 && (
          <Progress
            className='d-flex justify-content-center pt-2'
            percent={progress}
            steps={10}
          />
        )}
        <Button
          onClick={handleAddLesson}
          className='col mt-3'
          size='large'
          type='primary'
          disabled={!values.title || !values.content || isEmpty(values.video)}
          loading={uploading || videoRemoving || savingLesson}
          shape='round'
        >
          {uploading
            ? 'Video Uploading'
            : videoRemoving
            ? 'Video Removing'
            : savingLesson
            ? 'Saving'
            : 'Save'}
        </Button>
      </form>
    </div>
  );
};

export default AddLessonForm;
