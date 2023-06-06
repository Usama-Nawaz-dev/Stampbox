const handleConfirm = async (values, resetForm) => {
    // setLoading(true);
    dispatch(allActions.DataAction.ActivityModal(true));
    try {
      await auth().createUserWithEmailAndPassword(
        values.email,
        values.password
      );
      // await auth().currentUser.sendEmailVerification();
      const user = auth().currentUser;
      const firebaseToken = await user.getIdToken();
      const {
        email,
        password,
        firstName,
        lastName,
        userName,
        phone,
        confirmPassword,
        dob,
        language,
        age,
        address,
        gender,
      } = values;
      let my_address = JSON.stringify(address);
      const body = {
        firebase_token: firebaseToken,
        first_name: firstName,
        last_name: lastName,
        username: userName,
        email: email,
        phone: Number(phone),
        language: language,
        address: address == null ? address : my_address,
        gender: gender,
        dob: Number(dob),
        device_name: "mobile",
        is_email_verified: 0,
      };
      // console.log("body", body);
      const response = await MindAxios.post(Env.createUrl("signup"), body);
      // console.log("response-->", response);
      // console.log('response2-->', response?.status);
      // console.log('response3-->', response?.data);
      if (response?.status == 200) {
        dispatch(allActions.DataAction.User(values));
        // console.log('response-->', response);
        // setLoading(false);
        let result = response?.data?.result;
        let token = result?.token;
        await Helper.storeData("loginToken", token);
        resetForm();
        resetValues();
        dispatch(allActions.DataAction.ActivityModal(false));
        // dispatch(allActions.DataAction.VerifyModal(false));
        navigation.navigate("category");
        // dispatch(allActions.DataAction.CheckEmail(false));
      }
      // await auth().signOut();
      // setLoading(false);
      // resetForm();
      // resetValues();
      // navigation.navigate("confirm", { values: values });
    } catch (error) {
      // console.log("error", error);
      dispatch(allActions.DataAction.ActivityModal(false));
      // setLoading(false);
      alert(error);
    }
  };