// LocalStorage present and available checker
// See https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
export function storageAvailable (type) {
  let storage
  try {
    storage = window[type]
    const x = "__storage_test__"
    storage.setItem(x, x)
    storage.removeItem(x)
    return true
  } catch (e) {
    return (
      e instanceof DOMException &&
      // everything except Firefox
      (e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === "QuotaExceededError" ||
        // Firefox
        e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    )
  }
}

export function localStorageAvailable () {
  return storageAvailable('localStorage')
}

// LocalStorage keys
export const FBC_RECORD_CONTENT = 'FBC_RECORD_CONTENT'
export const FBC_RECORD_NUMBER = 'FBC_RECORD_NUMBER'
export const FBC_CLASSIFICATION = 'FBC_CLASSIFICATION'
export const FBC_RECORD_SEAL = 'FBC_RECORD_SEAL'
export const FBC_RECORD_STAMP = 'FBC_RECORD_STAMP'
