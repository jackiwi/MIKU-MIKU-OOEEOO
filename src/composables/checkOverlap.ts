const checkOverlap = (array1:any, array2:any) => {
  if (typeof array1 == "string"){
    return array2.includes(array1);
  }
  if (typeof array2.value == "string"){
    return array1.includes(array2);
  }

  for (var i = 0; i < array1.length; i++){
    for (var j = 0; j < array2.length; j++){
      if (array1[i] == array2[j]){
        return true;
      }
    }
  }
  return false;
};

export default checkOverlap;