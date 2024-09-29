export function removeDuplicates<T>(arr: Array<T>): Array<T> {
  const uniqueArray: Array<T> = []
  
  // Percorre o array original
  for (let i = 0; i < arr.length; i++) {
    const value = arr[i]
    let exists = false
  
    // Verifica se o valor já existe no array único
    for (let j = 0; j < uniqueArray.length; j++) {
      if (uniqueArray[j] == value) {
        exists = true
        break
      }
    }
  
    // Se o valor não existir, adiciona ao array de únicos
    if (!exists)  uniqueArray.push(value)
  }
  
  return uniqueArray
}