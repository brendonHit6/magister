function isEmpty(obj) {
  return JSON.stringify(obj) === '{}';
}

export { isEmpty }