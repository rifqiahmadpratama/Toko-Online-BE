const createPool = require("../config/db");
const { sendVerificationEmail } = require("../helper/verification");

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

const findEmailAndCode = (email, verification_code, result) => {
  return createPool.query(
    `SELECT * FROM user WHERE email='${email}' AND verification_code='${verification_code}'`,
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

const updateVerify = (email, verification_code, result) => {
  return createPool.query(
    `UPDATE user SET verification_code = 1 WHERE email = '${email}' AND verification_code = ${verification_code}`,
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
const addAlluser = (
  id,
  email,
  passwordHash,
  name,
  role,
  verification_code,
  result
) => {
  return createPool.query(
    `INSERT INTO user (id,email,passwordHash,name,photo,address,role,verification_code) 
  VAlUES ('${id}','${email}','${passwordHash}','${name}','','','${role}',${verification_code})`,
    function (err, res) {
      if (err) {
        console.log("error = ", err);
        result(err);
      } else {
        sendVerificationEmail(email, verification_code);
        result(null, res);
      }
    }
  );
};

module.exports = {
  findEmail,
  findEmailAndCode,
  updateVerify,
  updateProfile,
  getAlluser,
  addAlluser,
};
