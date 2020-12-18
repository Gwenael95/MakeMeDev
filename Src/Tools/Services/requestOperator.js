/**
 * @namespace Tools
 */
/**
 * setUpdateValue
 * @function
 * @memberOf Tools
 * @name setUpdateValue -
 * Define all keys to set
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
