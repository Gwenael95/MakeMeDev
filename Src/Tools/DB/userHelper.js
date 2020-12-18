/**
 * @namespace Tools
 */
/**
 * filterPassword
 * @function
 * @memberOf Tools
 * @name filterPassword -
 * Delete user password, to avoid security issues.
 * if we forgot to add lean to delete password, we ensure to return a useless string
 * @param {object} data - an object from where to delete one field : password
 * @returns {object}
 */
function filterPassword(data) {
    data["password"] = ":)"
    delete data.password
    return data
}

module.exports = {filterPassword}
