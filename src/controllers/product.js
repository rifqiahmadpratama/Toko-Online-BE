const productModel = require("../models/product");
const bcrypt = require("bcryptjs");
const commonHelper = require("../helper/common");
const authHelper = require("../helper/auth");
const { countproduct, findEmail } = require("../models/product");

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dkkjnukap",
  api_key: "929467144912289",
  api_secret: "HVYRoewPVoqjnrlgNg4cYkH2bEY",
});

const productController = {
  getAllproduct: async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const startPage = (page - 1) * limit;
    const sortby = req.query.sortby || "name";
    const sort = req.query.sort || "ASC";
    const search = req.query.search;
    let querysearch = "";
    if (search) {
      querysearch = `where type like '%${search}%' or name like '%${search}%' `;
    }

    productModel.getproduct(
      limit,
      startPage,
      sort,
      sortby,
      querysearch,
      function (err, user) {
        if (err) res.send(err);
        // res.send(user);
        const cek = new Promise((resolve, reject) => {
          countproduct(function (err, user) {
            if (err) {
              reject(err);
            }
            resolve(user);
          });
        });

        cek.then((data) => {
          const totalData = parseInt(data[0]["COUNT(*)"]);
          const totalPage = Math.ceil(totalData / limit);

          res.status(200).json({
            data: {
              page: page,
              limit: limit,
              totalRows: totalData,
              totalPage: totalPage,
              data: user,
            },
          });
        });
      }
    );
  },
  createProduct: async (req, res, next) => {
    try {
      const email = req.payload.email;
      const photo = req.file.path;
      const result = await cloudinary.uploader.upload(photo);
      const photoulr = result.secure_url;
      const { type, name, price, desciption } = req.body;

      const cek = new Promise((resolve, reject) => {
        findEmail(email, function (err, user) {
          if (err) {
            reject(err);
          }
          resolve(user);
        });
      });

      cek.then((data) => {
        const user_id = data[0].id;
        productModel.addAllproduct(
          type,
          name,
          price,
          photoulr,
          desciption,
          user_id,

          function (err, user) {
            if (err) res.send(err);
            res.send(user);
          }
        );
      });
    } catch (err) {
      console.log(err);
    }
  },

  updateProduct: async (req, res, next) => {
    try {
      const email = req.payload.email;
      const photo = req.file.path;
      const result = await cloudinary.uploader.upload(photo);
      const photoulr = result.secure_url;
      const id = Number(req.params.id);
      const { type, name, price, desciption } = req.body;

      const cek = new Promise((resolve, reject) => {
        findEmail(email, function (err, user) {
          if (err) {
            reject(err);
          }
          resolve(user);
        });
      });

      cek.then((data) => {
        const user_id = data[0].id;

        productModel.updateProduct(
          id,
          user_id,
          type,
          name,
          price,
          photoulr,
          desciption,

          function (err, user) {
            if (err) res.send(err);
            res.send(user);
          }
        );
      });
    } catch (err) {
      console.log(err);
    }
  },

  deleteProduct: async (req, res) => {},
};

module.exports = productController;
