const { v4: uuidv4 } = require ("uuid");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const users = require('../models/user');

const db = require("../models");
const Utilisateurs = db.utilisateurs;
const Op = db.Sequelize.Op;

const SECRET_KEY = 'HELLOHELLOHELLO';
const ACCESS_TOKEN_EXPIRATION = '15m';
const REFRESH_TOKEN_EXPIRATION = '7d';

// Generate JWT Tokens
const generateToken = (user) => {
    const payload = {
        email: user.email,
        pseudo: user.pseudo,
        issuedAt: Date.now(),
    };

    const accessToken = jwt.sign(payload, SECRET_KEY, { expiresIn: ACCESS_TOKEN_EXPIRATION });
    const refreshToken = jwt.sign(payload, SECRET_KEY, { expiresIn: REFRESH_TOKEN_EXPIRATION });

    return { accessToken, refreshToken };
};

// Register user
exports.registerUser = async (req, res) => {
    const { email, pseudo, password } = req.body;

    if (!email || !pseudo || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
        return res.status(409).json({ message: 'User already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
        userid: `user-${Date.now()}`,
        email,
        pseudo,
        password: hashedPassword,
    };
    users.push(newUser);

    const tokens = generateToken(newUser);
    res.status(201).json({ message: 'User registered successfully.', tokens });
};

// Login user
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    Utilisateurs.findOne({ where: { email: email } })
    .then(data => {
      if (data) {
        const user = {
          id: data.id,
          pseudo: data.pseudo,
          email: data.email
        };
      
        const tokens = generateToken(user);

        res.setHeader('Authorization', `Bearer ${tokens}`);
        res.status(200).json({ message: 'Login successful.', tokens, pseudo: user.pseudo });
      } else {
        res.status(404).send({
          message: `Cannot find Utilisateur with email=${email}.`
        });
      }
    })
    .catch(err => {
      res.status(400).send({
        message: "Error retrieving Utilisateur with email=" + email
      });
    });



};

// Get user info
exports.getUser = (req, res) => {
    const { userid } = req.user;

    //we could extract all the information fril the req that comes from the authenticate middleware
    // but I prefer to get the user from the users array to verify that the user still exists
    const user = users.find((user) => user.userid === userid);
    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    const { email, pseudo } = user;
    res.status(200).json({ userid, email, pseudo });
};

// Update user details
exports.updateUser = (req, res) => {
    const { userid } = req.user;
    //password is for now not sent in the request body
    const { email, pseudo, password } = req.body;

    const user = users.find((user) => user.userid === userid);
    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    if (email) user.email = email;
    if (pseudo) user.pseudo = pseudo;
    if (password) user.password = bcrypt.hashSync(password, 10);

    res.status(200).json({ message: 'User updated successfully.', user });
};