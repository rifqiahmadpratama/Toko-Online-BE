const createPool = require("../config/db");

const findEmail = (email, result) => {
  return createPool.query(
    `SELECT * FROM user WHERE email='${email}'`,
    function (err, res) {
      if (err) {
        console.log("error a = ", err);
        result(err);
      } else {
        result(null, res);
      }
    }
  );
};

const updateProfile = (email, name, photo, address, result) => {
  return createPool.query(
    `UPDATE user SET name = '${name}',photo = '${photo}', address = '${address}' WHERE email='${email}'`,
    function (err, res) {
      if (err) {
        console.log("error a = ", err);
        result(err);
      } else {
        result(null, res);
      }
    }
  );
};

const getAlluser = (result) => {
  return createPool.query(`SELECT * FROM USER`, function (err, res) {
    if (err) {
      console.log("error = ", err);
      result(err);
    } else {
      result(null, res);
    }
  });
};
const addAlluser = (id, email, passwordHash, name, role, result) => {
  return createPool.query(
    `INSERT INTO user (id,email,passwordHash,name,photo,address,role) 
  VAlUES ('${id}','${email}','${passwordHash}','${name}','','','${role}')`,
    function (err, res) {
      if (err) {
        console.log("error = ", err);
        result(err);
      } else {
        result(null, res);
      }
    }
  );
};

module.exports = { findEmail, updateProfile, getAlluser, addAlluser };
