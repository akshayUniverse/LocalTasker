// frontend/src/components/JobRequestForm.js
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import './JobRequestForm.css'; // Import your CSS file for styling

const JobRequestForm = () => {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const initialValues = {
    name: '',
    location: '',
    workType: '',
    description: '',
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Required'),
    location: Yup.string().required('Required'),
    workType: Yup.string().required('Required'),
    description: Yup.string().required('Required'),
  });

  const onSubmit = async (values, { resetForm }) => {
    setLoading(true);
    setServerError('');
    try {
      // Update the URL if needed to match your backend route
      await axios.post('http://localhost:5000/api/job-requests', values);
      alert("Job request submitted!");
      resetForm();
    } catch (error) {
      setServerError('Error submitting job request');
      alert("Error submitting job request");
    }
    setLoading(false);
  };

  return (
    <div className="jobrequest-container">
      <h2>Submit a Job Request</h2>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {() => (
          <Form>
            <label htmlFor="name">Name:</label>
            <Field id="name" name="name" type="text" />
            <ErrorMessage name="name" component="div" />

            <label htmlFor="location">Location:</label>
            <Field id="location" name="location" type="text" />
            <ErrorMessage name="location" component="div" />

            <label htmlFor="workType">Type of Work Required:</label>
            <Field id="workType" name="workType" type="text" placeholder="e.g., Plumbing, Electrical" />
            <ErrorMessage name="workType" component="div" />

            <label htmlFor="description">Details/Requirements:</label>
            <Field id="description" name="description" as="textarea" />
            <ErrorMessage name="description" component="div" />

            <button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
            {serverError && <div style={{ color: 'red' }}>{serverError}</div>}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default JobRequestForm;
