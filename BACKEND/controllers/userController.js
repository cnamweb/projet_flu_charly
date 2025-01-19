const { v4: uuidv4 } = require("uuid");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const db = require("../models");
const Utilisateurs = db.utilisateurs;
const Op = db.Sequelize.Op;

const SECRET_KEY = 'HELLOHELLOHELLO';
const ACCESS_TOKEN_EXPIRATION = '15m';
const REFRESH_TOKEN_EXPIRATION = '7d';

// Generate JWT Tokens
const generateToken = (user) => {
  const payload = {
    user,
    issuedAt: Date.now(),
  };

  const accessToken = jwt.sign({ ...payload, type: 'access' }, SECRET_KEY, { expiresIn: ACCESS_TOKEN_EXPIRATION });
  const refreshToken = jwt.sign({ ...payload, type: 'refresh' }, SECRET_KEY, { expiresIn: REFRESH_TOKEN_EXPIRATION });

  return { accessToken, refreshToken };
};

// Register user
exports.registerUser = async (req, res) => {
  const { email, pseudo, password } = req.body;

  if (!email || !pseudo || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  Utilisateurs.findOne({ where: { email: email } })
    .then(async data => {
      if (data) {
        return res.status(400).json({ message: 'Email already exists.' });
      }

      const hashPassword = await bcrypt.hash(password, 10);
      //find biggest id in the database and increment it by 1
      Utilisateurs.findAll({ order: [['id', 'DESC']] }).then(data => {
        let userId = 1;
        if (data.length > 0) {
          userId = parseInt(data[0].id) + 1;
        }

        Utilisateurs.create({ id: userId, pseudo: pseudo, email: email, pass: hashPassword });
        res.status(201).json(
          {
            message: 'User created successfully.',
          });
      }
      ).catch(err => {
        res.status(500).json({ message: err.message || 'An error occurred while creating the user.' });
      });
    }
    ).catch(err => {
      res.status(500).json({ message: err.message || 'An error occurred while creating the user.' });
    });
};

// Login user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  Utilisateurs.findOne({ where: { email: email } })
    .then(data => {
      if (data) {
        bcrypt.compare(password, data.pass, (err, isValidPassword) => {
          if (err || !isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials.' });
          }
          const user = {
            id: data.id,
            pseudo: data.pseudo,
            email: data.email
          };

          const tokens = generateToken(user);

          res.setHeader('Authorization', `Bearer ${tokens}`);
          res.status(200).json({ message: 'Login successful.', tokens, pseudo: user.pseudo });
        });
      } else {
        res.status(404).send({
          message: `Cannot find Utilisateur with email=${email}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Utilisateur with email=" + email
      });
    });
};

// Get user info
exports.getUser = (req, res) => {
  console.log(req);

  const { email } = req.user;

  Utilisateurs.findOne({ where: { email: email } })
    .then(data => {
      if (data) {
        res.status(200).json({ email: data.email, pseudo: data.pseudo });
      } else {
        res.status(404).json({ message: 'User not found.' });
      }
    })
    .catch(err => {
      res.status(500).json({ message: err.message || 'An error occurred while retrieving the user.' });
    });
};

// Update user details
exports.updateUser = (req, res) => {
  const previousEmail = req.user.email;
  //password is for now not sent in the request body
  const { email, pseudo } = req.body;

  Utilisateurs.findOne({ where: { email: previousEmail } })
    .then(async data => {
      if (data) {
        if (email) data.email = email;
        if (pseudo) data.pseudo = pseudo;

        res.status(200).json({ message: 'User updated successfully.', user: data });

        await data.save();
      }
    })
    .catch(err => {
      res.status(500).json({ message: err.message || 'An error occurred while retrieving the user.' });
    });
};