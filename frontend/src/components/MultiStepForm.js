// frontend/src/components/MultiStepForm.js
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const StepOne = ({ next, values }) => {
  return (
    <div>
      <h2>Step 1: Basic Details</h2>
      <label>Name:</label>
      <Field name="name" type="text" />
      <ErrorMessage name="name" component="div" />
      
      <label>Location:</label>
      <Field name="location" type="text" />
      <ErrorMessage name="location" component="div" />

      <button type="button" onClick={() => next()}>Next</button>
    </div>
  );
};

const StepTwo = ({ next, prev, values }) => {
  return (
    <div>
      <h2>Step 2: Work Details</h2>
      <label>Work Type:</label>
      <Field name="workType" type="text" placeholder="e.g., Plumber, Electrician" />
      <ErrorMessage name="workType" component="div" />

      <label>Experience Level:</label>
      <Field name="experience" type="text" placeholder="Years of experience" />
      <ErrorMessage name="experience" component="div" />

      <button type="button" onClick={prev}>Back</button>
      <button type="button" onClick={() => next()}>Next</button>
    </div>
  );
};

const StepThree = ({ prev, values, setFieldValue }) => {
  // For portfolio image upload and pricing
  const handleImageChange = (e) => {
    setFieldValue('portfolioImages', e.currentTarget.files);
  };

  return (
    <div>
      <h2>Step 3: Portfolio & Pricing</h2>
      <label>Upload Portfolio Images:</label>
      <input name="portfolioImages" type="file" multiple onChange={handleImageChange} />
      <ErrorMessage name="portfolioImages" component="div" />

      <label>Pricing (per visit):</label>
      <Field name="pricing" type="text" placeholder="Enter your pricing" />
      <ErrorMessage name="pricing" component="div" />

      <button type="button" onClick={prev}>Back</button>
      <button type="submit">Submit</button>
    </div>
  );
};

const validationSchema = Yup.object({
  name: Yup.string().required('Required'),
  location: Yup.string().required('Required'),
  workType: Yup.string().required('Required'),
  experience: Yup.string().required('Required'),
  pricing: Yup.string().required('Required'),
  // For portfolioImages, you can add custom validations as needed
});

const MultiStepForm = () => {
  const [step, setStep] = useState(1);
  const initialValues = {
    name: '',
    location: '',
    workType: '',
    experience: '',
    portfolioImages: null,
    pricing: '',
  };

  const next = () => setStep(step + 1);
  const prev = () => setStep(step - 1);


  const handleSubmit = async (values) => {
  // Create a FormData object to send files
  const formData = new FormData();
  if (values.portfolioImages) {
    for (let i = 0; i < values.portfolioImages.length; i++) {
      formData.append('portfolioImages', values.portfolioImages[i]);
    }
  }
  // Upload images to S3
  const uploadResponse = await axios.post('http://localhost:5000/api/upload/upload-portfolio', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  // Add returned URLs to the profile data
  const profileData = {
    ...values,
    portfolioImages: uploadResponse.data.fileUrls,
  };
  // Now, call your profile update API (not shown here)
  console.log('Profile Data:', profileData);
};


//   const handleSubmit = (values) => {
//     // TODO: Call backend API to update profile info
//     console.log('Form Submitted', values);
//   };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
      {({ setFieldValue, values }) => (
        <Form>
          {step === 1 && <StepOne next={next} values={values} />}
          {step === 2 && <StepTwo next={next} prev={prev} values={values} />}
          {step === 3 && <StepThree prev={prev} values={values} setFieldValue={setFieldValue} />}
        </Form>
      )}
    </Formik>
  );
};

export default MultiStepForm;
