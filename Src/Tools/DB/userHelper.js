/**
 * @namespace Tools
 */
/**
 * Delete user password, to avoid security issues.
 * if we forgot to add lean to delete password, we ensure to return a useless string.
 * @function
 * @memberOf Tools
 * @name filterPassword
 * @param {object} data - an object from where to delete one field : password
 * @returns {object}
 */
function filterPassword(data) {
    data["password"] = ":)"
    delete data.password
    return data
}

module.exports = {filterPassword}
