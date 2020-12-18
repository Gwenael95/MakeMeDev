/**
 * @namespace Tools
 */
/**
 * Define all keys to set
 * @function
 * @memberOf Tools
 * @name setUpdateValue
 * @param {object} data - data that will be set
 * @param {array} keysArray - all keys to update
 * @returns {{$set: {}}}
 */
function setUpdateValue(data, keysArray) {
    let updateValue = {}
    for (let key of keysArray){
        updateValue[key] = data[key]
    }
    return {$set: updateValue}
}

module.exports = {setUpdateValue}
