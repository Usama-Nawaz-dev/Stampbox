import React from "react";
import ErrorMessage from "./ErrorMessage";
import { useFormikContext } from "formik";
import AppTextInput from "../../components/AppTextInput";

export default function AppFormField({ name, width, icon, ...otherProps }) {
  // console.log('otherProps', otherProps);
  const { setFieldTouched, setFieldValue, errors, touched, values } =
    useFormikContext();
  return (
    <>
      <AppTextInput
        onBlur={() => {
          setFieldTouched(name);
        }}
        onChangeText={(text) => setFieldValue(name, text)}
        value={values[name]}
        width={width}
        maxWidth={"85%"}
        icon={icon}
        name={name}
        {...otherProps}
      />
      {errors && <ErrorMessage error={errors[name]} visible={touched[name]} />}
    </>
  );
}
