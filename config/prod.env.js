'use strict'
// ==============以下为新增的==============
let PATH_ENV = '"test"'
if (process.env.PATH_ENV === 'prod') PATH_ENV = '"prod"'
console.log(PATH_ENV)
// ==============以上为新增的==============

module.exports = {
    NODE_ENV: '"production"',
    // ==============以下为新增的==============
    PATH_ENV
    // ==============以上为新增的==============
}
