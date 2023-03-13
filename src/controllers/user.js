const userModel = require("../models/user");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const commonHelper = require("../helper/common");
const authHelper = require("../helper/auth");
const {
  findEmail,
  updateProfile,
  findEmailAndCode,
  updateVerify,
} = require("../models/user");
const { generateVerificationCode } = require("../helper/verification");

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_key,
});
const userController = {
  getAlluser: async (req, res) => {
    await userModel.getAlluser(function (err, user) {
      if (err) res.send(err);
      res.send(user);
    });
  },
  verify: async (req, res) => {
    const { email, verification_code } = req.query;
    const cek = await new Promise((resolve, reject) => {
      findEmailAndCode(email, verification_code, function (err, user) {
        if (err) {
          reject(err);
        }
        resolve(user);
      });
    });
    if (cek.length > 0) {
      updateVerify(email, verification_code, function (err, user) {
        if (err) res.send(err);
        res.send("Verify Berhasil");
      });
    } else {
      res.send("email sudah ada");
    }
  },
  registerPenjual: async (req, res) => {
    try {
      const id = uuidv4();
      const { email, password, name } = req.body;
      const passwordHash = bcrypt.hashSync(password);
      const role = "penjual";
      const verification_code = generateVerificationCode();
      const cek = await new Promise((resolve, reject) => {
        findEmail(email, function (err, user) {
          if (err) {
            reject(err);
          }
          resolve(user);
        });
      });

      if (cek.length <= 0) {
        await userModel.addAlluser(
          id,
          email,
          passwordHash,
          name,
          role,
          verification_code,
          function (err, user) {
            if (err) res.send(err);
            res.send("Register Berhasil");
          }
        );
      } else {
        res.send("email sudah ada");
      }
    } catch (err) {
      console.log(err);
    }
  },
  registerPembeli: async (req, res) => {
    try {
      const id = uuidv4();
      const { email, password, name } = req.body;
      const passwordHash = bcrypt.hashSync(password);
      const role = "pembeli";

      const cek = await new Promise((resolve, reject) => {
        findEmail(email, function (err, user) {
          if (err) {
            reject(err);
          }
          resolve(user);
        });
      });

      if (cek.length <= 0) {
        await userModel.addAlluser(
          id,
          email,
          passwordHash,
          name,
          role,
          function (err, user) {
            if (err) res.send(err);
            res.send("Register Berhasil");
          }
        );
      } else {
        res.send("email sudah ada");
      }
    } catch (err) {
      console.log(err);
    }
  },
  refreshToken: (req, res) => {
    const refershToken = req.body.refershToken;
    const decoded = jwt.verify(refershToken, process.env.SECRETE_KEY_JWT);
    const payload = {
      email: decoded.email,
    };
    const result = {
      token: authHelper.generateToken(payload),
      refershToken: authHelper.generateRefershToken(payload),
    };
    commonHelper.response(res, result, 200);
  },
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const cek = await new Promise((resolve, reject) => {
        findEmail(email, function (err, user) {
          if (err) {
            reject(err);
          }
          resolve(user);
        });
      });
      console.log("login = ", cek[0].verification_code);
      if (cek[0].verification_code == 1) {
        findEmail(email, function (err, user) {
          if (err) return err;
          if (user.length > 0) {
            console.log(user[0].passwordHash);
            const isValidPassword = bcrypt.compareSync(
              password,
              user[0].passwordHash
            );
            console.log(isValidPassword);
            if (isValidPassword == false) {
              return commonHelper.response(
                res,
                null,
                403,
                "Password is invalid"
              );
            }
            delete user.password;
            const payload = {
              email: user[0].email,
            };
            const user1 = {
              name: "",
              token: "",
              refreshToken: "",
              id: "",
            };

            user1.name = user[0].name;
            user1.id = user[0].id;
            user1.token = authHelper.generateToken(payload);
            user1.refreshToken = authHelper.generateRefershToken(payload);

            commonHelper.response(res, user1, 201, "login is successful");
          } else {
            return commonHelper.response(res, null, 403, "Email is invalid");
          }
        });
      } else {
        res.send("Email Belum d Verifikasi");
      }
    } catch (error) {
      console.log(error);
    }
  },
  profile: async (req, res, next) => {
    const email = req.payload.email;
    await findEmail(email, function (err, user) {
      if (err) {
        res.send(err);
      }
      delete user[0].passwordHash;
      //   res.send(user);
      commonHelper.response(res, user, 200, "Profile is successful");
    });
  },

  updateProfile: async (req, res, next) => {
    try {
      const email = req.payload.email;
      const photo = req.file.path;

      const result = await cloudinary.uploader.upload(photo);
      const photoulr = result.secure_url;

      const { name, address } = req.body;
      await updateProfile(
        email,

        name,
        photoulr,
        address,
        function (err, user) {
          if (err) {
            res.send(err);
          }
          commonHelper.response(res, user, 200, "Update Profile is successful");
        }
      );
    } catch (err) {
      console.log(err);
    }
  },
};

module.exports = userController;
