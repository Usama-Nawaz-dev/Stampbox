const deformCart = (products) => {
  // let desired = [];
  let stores = products.map((item) => {
    let store = `${item.store_name}_${item.store_id.toString()}`;
    return store;
  });
  let keyCount = 0;
  let uniq = [...new Set(stores)];
  let myObj = {};
  uniq.forEach((store_name) => {
    myObj[store_name] = [];
    ++keyCount;
  });

  // console.log("1st-->", keyCount);
  products.forEach((item) => {
    //   let store = item.store_name;
    // console.log("item", item);
    let store = `${item.store_name}_${item.store_id.toString()}`;
    myObj[store].push(item);
  });

  return { myObj, keyCount };
};

const storeCart = (myObj, to_address) => {
  let desired = [];
  Object.keys(myObj).map((key, index) => {
    // console.log("key", key);
    desired.push(myObj[key]);
  });
  // console.log('desired', desired)
  let newObj = {};
  desired.forEach((item1, index) => {
    // console.log('index', index)
    newObj[index] = {};
    newObj[index].parcels = [];
    item1.forEach((item2) => {
      // console.log('index', index)
      // ob1 = {};
      newObj[index].id = item2.store_id;
      newObj[index].to_address = to_address;
      // newObj[index].parcels = [];
      newObj[index].parcels.push(item2.parcel);
    });
  });
  let stores = [];
  // console.log("newObj", newObj);
  Object.keys(newObj).map((key, index) => {
    // console.log("key", key);
    stores.push(newObj[key]);
  });
  let newVal = { stores: stores };
  // console.log("newReq", JSON.stringify(newVal));

  return newVal;
};

export default { storeCart, deformCart };
