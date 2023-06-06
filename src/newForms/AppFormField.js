import React from "react";
import ErrorMessage from "./ErrorMessage";
import { useFormikContext } from "formik";
import AppTextInput from "../../components/AppTempInput";

export default function AppFormField({
  name,
  width,
  icon,
  inputLabel,
  current,
  setCurrent,
  setFieldValue,
  val,
  ...otherProps
}) {
  // console.log('otherProps', otherProps);
  // const { setFieldTouched, setFieldValue, errors, touched, values } =
  //   useFormikContext();

  return (
    <>
      <AppTextInput
        // onBlur={() => {
        //   setFieldTouched(name);
        // }}
        // setField={() => setFieldTouched(name)}
        // onFocus={onFocusHandler}
        // onBlur={onBlurHandler}
        onChangeText={(text) => {
          setFieldValue(text)
        }}
        value={val}
        editable={true}
        width={width}
        inputLabel={inputLabel}
        maxWidth={"90%"}
        icon={icon}
        name={name}
        current={current}
        setCurrent={setCurrent}
        moveTop={moveText}
        {...otherProps}
      />
      {/* {errors && <ErrorMessage error={errors[name]} visible={touched[name]} />} */}
    </>
  );
}
