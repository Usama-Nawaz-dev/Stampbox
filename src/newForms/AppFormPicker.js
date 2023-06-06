import React from "react"
import { StyleSheet } from "react-native"
// import AppPicker from "../../components/AppPicker"
import { ErrorMessage } from "."
import { useFormikContext } from "formik"

export default function AppFormPicker({
  items,
  name,
  numberOfColumns,
  PickerItemComponent,
  placeholder,
  width,
}) {
  const { errors, setFieldValue, touched, values } = useFormikContext()
  return (
    <>
      <AppPicker
        numberOfColumns={numberOfColumns}
        items={items}
        onSelectItem={item => setFieldValue(name, item)}
        PickerItemComponent={PickerItemComponent}
        placeholder={placeholder}
        selectedItem={values[name]}
        width={width}
      />
      <ErrorMessage visible={touched[name]}>{errors[name]}</ErrorMessage>
    </>
  )
}

const styles = StyleSheet.create({})
