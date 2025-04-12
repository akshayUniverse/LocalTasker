// frontend/src/components/MultiStepForm.js
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import * as Yup from 'yup';
import './MultiStepForm.css'; // Import your CSS file for styling

// Step 1: Basic Details Component
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

      <button type="button" className="next-button" onClick={next}>Next</button>
    </div>
  );
};

// Step 2: Work Details Component
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

      <div className="button-group">
        <button type="button"  onClick={prev}>Back</button>
        <button type="button"  onClick={next}>Next</button>
      </div>

    </div>
  );
};

// Step 3: Portfolio & Pricing Component
const StepThree = ({ prev, setFieldValue, values }) => {
  // Optionally, you can enable the image upload logic later.
  // const handleImageChange = (e) => {
  //   setFieldValue('portfolioImages', e.currentTarget.files);
  // };

  return (
    <div>
      <h2>Step 3: Portfolio & Pricing</h2>
      {/*
      <label>Upload Portfolio Images:</label>
      <input 
        name="portfolioImages" 
        type="file" 
        multiple 
        onChange={handleImageChange} 
      />
      <ErrorMessage name="portfolioImages" component="div" />
      */}
      <label>Pricing (per visit):</label>
      <Field name="pricing" type="text" placeholder="Enter your pricing" />
      <ErrorMessage name="pricing" component="div" />

      <div class="button-group">
        <button type="button" onClick={prev}>Back</button>
        <button type="submit">Submit</button>
      </div>
    </div>
  );
};

// Validation Schema using Yup
const validationSchema = Yup.object({
  name: Yup.string().required('Required'),
  location: Yup.string().required('Required'),
  workType: Yup.string().required('Required'),
  experience: Yup.string().required('Required'),
  pricing: Yup.string().required('Required'),
  // Add custom validation for portfolioImages if needed later
});

const MultiStepForm = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  console.log("Email received in MultiStepForm:", email);


  const [step, setStep] = useState(1);
  const initialValues = {
    name: '',
    location: '',
    workType: '',
    experience: '',
    portfolioImages: null, // For future image uploads
    pricing: '',
  };

  const next = () => setStep(step + 1);
  const prev = () => setStep(step - 1);

  const handleSubmit = async (values) => {
    try {
      // Optionally, handle file uploads if enabled; for now, we just submit form data
      // Call the backend endpoint to update the user's profile with detailed info
      // Here we assume an endpoint like POST /api/users/updateprofile exists

      const response = await axios.post("http://localhost:5000/api/users/updateProfile", {
        ...values,
        email  // Pass email to identify the user
      });
      alert("Profile updated successfully!");
      // Redirect to the profile page with the user ID or email returned from the backend
      navigate("/profile", { state: { email } });
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile");
    }
  };

  return (
    <div className="multistep-container">
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ setFieldValue, values }) => (
          <Form>
            {step === 1 && <StepOne next={next} values={values} />}
            {step === 2 && <StepTwo next={next} prev={prev} values={values} />}
            {step === 3 && <StepThree prev={prev} values={values} setFieldValue={setFieldValue} />}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default MultiStepForm;
