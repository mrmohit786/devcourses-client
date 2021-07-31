import { Select, Button, Avatar, Badge } from 'antd';

const { Option } = Select;

const CourseCreateForm = ({
  values,
  handleSubmit,
  handleChange,
  setValues,
  handleImageUpload,
  preview,
  uploadButtonText,
  handleImageRemove,
}) => {
  const children = [];
  for (let i = 9.99; i <= 99.99; i++) {
    children.push(<Option key={i.toFixed(2)}>${i.toFixed(2)}</Option>);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className='form-group'>
        <input
          type='text'
          name='name'
          placeholder='Name'
          value={values.name}
          className='form-control'
          onChange={handleChange}
        />
      </div>
      <div className='form-group'>
        <textarea
          name='description'
          cols='7'
          rows='7'
          value={values.description}
          className='form-control'
          onChange={handleChange}
        ></textarea>
      </div>
      <div className='form-row'>
        <div className='col'>
          <div className='form-group'>
            <Select
              value={values.paid}
              style={{ width: '100%' }}
              size='large'
              onChange={v => setValues({ ...values, paid: v, price: 0 })}
            >
              <Option value={true}>Paid</Option>
              <Option value={false}>Free</Option>
            </Select>
          </div>
        </div>
        {values.paid && (
          <div className='form-group'>
            <Select
              defaultValue='$9.99'
              style={{ width: '100%' }}
              onChange={v => setValues({ ...values, price: v })}
              tokenSeparators={[,]}
              size='large'
            >
              {children}
            </Select>
          </div>
        )}
      </div>

      <div className='form-row'>
        <div className='col'>
          <div className='form-group'>
            <label className='btn btn-outline-secondary btn-block text-left'>
              {uploadButtonText}
              <input
                type='file'
                name='image'
                onChange={handleImageUpload}
                accept='image/*'
                hidden
              />
            </label>
          </div>
        </div>
        {preview && (
          <Badge
            count='X'
            onClick={handleImageRemove}
            className='cursor-pointer'
          >
            <Avatar width={200} src={preview} />
          </Badge>
        )}
      </div>
      <div className='form-group'>
        <input
          type='text'
          name='category'
          placeholder='Category'
          value={values.category}
          className='form-control'
          onChange={handleChange}
        />
      </div>
      <div className='row'>
        <div className='col'>
          <Button
            className='btn btn-primary'
            loading={values.loading}
            onClick={handleSubmit}
            type='primary'
            size='large'
            shape='round'
            disabled={
              values.loading ||
              values.uploading ||
              !values.name ||
              !values.description
            }
          >
            {values.loading ? 'Saving...' : 'Save & Continue'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CourseCreateForm;
