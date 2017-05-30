const _ = require('lodash');
const Admin = require('../models/admin');
const bcrypt = require('bcryptjs');

module.exports = {
  createNewAdmin(req, res, next) {
    const adminProps = _.pick(req.body, ['email', 'password']);
    const admin = new Admin(adminProps);

    admin.save().then(() => { return admin.generateAuthToken() })
      .then((token) => {
        res.header('x-auth', token).send(admin)
      })
      .catch(next);
  },

  login(req, res, next) {
    const loginProps = _.pick(req.body, ['email', 'password']);

    Admin.findByCredentials(loginProps.email, loginProps.password)
      .then((admin) => {
        return admin.generateAuthToken()
          .then((token) => {
            res.header('x-auth', token).send(admin);
          })
      })
      .catch((error) => {
        res.status(400).send();
      });
  },

  testing(req, res, next) {
    res.send(req.admin)
  }
};
