export function merge(keyName, arr){
  var result = {}
  arr.forEach(element => {
    const value = element[keyName]
    result[value] = element
  })
  return result
}
