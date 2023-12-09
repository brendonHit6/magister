import { addVectors } from './vectors'

const vectorTableTransform = (item, vector) => {
  const Ai = [item.x, item.y, item.z ]
  const UA = []
  const VA = []
  const WA = []
  const dep = {
    0: UA,
    1: VA,
    2: WA,
  }

  vector.forEach((element) => {
    const index = vector.indexOf(element)
    dep[index].push(element[0] * Ai[index], element[1] * Ai[index], element[2] * Ai[index])
  })
  const vectorSum = addVectors(UA, VA, WA)

  return vectorSum
}

export { vectorTableTransform }