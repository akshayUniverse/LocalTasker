// frontend/src/components/JobRequestForm.js
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const JobRequestForm = () => {
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
    try {
      // Call your backend endpoint to submit the job request
      await axios.post('http://localhost:5000/api/job-requests', values);
      alert("Job request submitted!");
      resetForm();
    } catch (error) {
      alert("Error submitting job request");
    }
  };

  return (
    <div>
      <h2>Submit a Job Request</h2>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        <Form>
          <label>Name:</label>
          <Field name="name" type="text" />
          <ErrorMessage name="name" component="div" />

          <label>Location:</label>
          <Field name="location" type="text" />
          <ErrorMessage name="location" component="div" />

          <label>Type of Work Required:</label>
          <Field name="workType" type="text" placeholder="e.g., Plumbing, Electrical" />
          <ErrorMessage name="workType" component="div" />

          <label>Details/Requirements:</label>
          <Field name="description" as="textarea" />
          <ErrorMessage name="description" component="div" />

          <button type="submit">Submit Request</button>
        </Form>
      </Formik>
    </div>
  );
};

export default JobRequestForm;
