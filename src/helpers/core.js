const FilterChars = string => {
  return string.replace(/\s+/g, " ").replace(/[^a-zA-Z0-9_ ]/g, "")
}

const StringLength = (string, minimumLength) => {
  return string.length > minimumLength ? false : true
}

const Duplicates = (newString, stringArray) => {
  const upperCase = stringArray.map(driver => driver.toUpperCase())
  upperCase.push(newString.toUpperCase().trim())
  let findDuplicates = arr =>
    arr.filter((item, index) => arr.indexOf(item) !== index)
  return findDuplicates(upperCase).length ? true : false
}

const InputVerification = (verifySingle, verifyList) => {
  let errorList = []
  if (Duplicates(verifySingle, verifyList)) {
    errorList.push("Duplicate Found!")
  }
  if (StringLength(verifySingle, 2)) {
    errorList.push("Please enter a name above 2 characters.")
  }
  return errorList
}

export { FilterChars, StringLength, Duplicates, InputVerification }
