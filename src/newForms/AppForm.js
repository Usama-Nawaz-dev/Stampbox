import React from 'react';
import {Formik} from 'formik';

export default function AppForm({
  initialValues,
  validationSchema,
  validateOnChange,
  onSubmit,
  children,
}) {
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      enableReinitialize
      validateOnChange={validateOnChange}
      validationSchema={validationSchema}>
      {() => <>{children}</>}
    </Formik>
  );
}
