const userSchema = require('../models/user.model');
const blacklistSchema = require('../models/blacklist.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const register = async (req, res) => {
    const { username, email, password } = req.body;
    const newUser = await userSchema.create({ username, email, password:bcrypt.hashSync(password, 10) });
    const token  = jwt.sign({ id: newUser._id, username: newUser.username }, process.env.JWT_SECRET);
    res.cookie('token', token);
    
    res.status(201).json({ message: 'User registered successfully', newUser: { id: newUser._id, username: newUser.username, email: newUser.email } });
}

const login = async (req, res) => {
        const { email, password } = req.body;
        const user = await userSchema.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Wrong password, please try again' });
        }
        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET);
        res.cookie('token', token);
        res.json({ message: 'Login successful', token, user: {
            _id: user._id,
            email: user.email,
            username: user.username
            } });
    };

    const logout = async (req, res) => {
        const token = req.cookies.token;
        if (token) {
            await blacklistSchema.create({ token });
        }
        res.clearCookie('token');
        res.status(200).json({ message: 'Logout successful' });
    }

    const getMe = async (req, res) => {
        const user = await userSchema.findById(req.user.id)

        res.status(200).json({ message: 'User details retrieved successfully', user: { id: user._id, username: user.username, email: user.email } });
    }

    module.exports = { register, login, logout, getMe }