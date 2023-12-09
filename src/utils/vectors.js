const coordinateTransform = (initialVector, vector) => {

  console.log(initialVector, vector)
}

const addVectors = (...vectors) => {
  if (vectors.some((v, i) => v.length !== vectors[0].length)) {
    throw new Error("Вектори повинні мати однакову довжину");
  }

  const v3 = [];

  for (let i = 0; i < vectors[0].length; i++) {
    v3.push(vectors.reduce((a, b) => a + b[i], 0));
  }

  return v3;
}

export { coordinateTransform, addVectors }