const createPool = require("../config/db");

const countproduct = (result) => {
  return createPool.query(`SELECT COUNT(*) FROM product`, function (err, res) {
    if (err) {
      console.log("error a = ", err);
      result(err);
    } else {
      result(null, res);
    }
  });
};

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

const updateProduct = (
  id,
  user_id,
  type,
  name,
  price,
  photoulr,
  desciption,

  result
) => {
  return createPool.query(
    `UPDATE product SET type = '${type}', name = '${name}',price = ${price}, photo = '${photoulr}',desciption = '${desciption}' WHERE user_id='${user_id}' AND id=${id}`,
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

const getproduct = (
  numberPerPage,
  startPage,
  sort,
  sortby,
  querySearch,
  result
) => {
  return createPool.query(
    `SELECT * FROM product ${querySearch} ORDER BY ${sortby} ${sort} LIMIT ${numberPerPage} OFFSET ${startPage}`,
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
const addAllproduct = (
  type,
  name,
  price,
  photoulr,
  desciption,
  user_id,
  result
) => {
  return createPool.query(
    `INSERT INTO product (type, name, price, photo, desciption, user_id) VALUES ('${type}', '${name}', ${price}, '${photoulr}', '${desciption}', '${user_id}')`,
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

module.exports = {
  countproduct,
  findEmail,
  updateProduct,
  getproduct,
  addAllproduct,
};
