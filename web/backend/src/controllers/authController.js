import User from '../models/userModel.js';
import Token from '../models/tokenModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendEmail } from '../utils/sendEmail.js';

const frontendUrl = () => process.env.FRONTEND_URL || 'https://ehfakeounao.vercel.app';


const registerUser = async (req, res) => {
    const { fullName, email, password, confirmPassword } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'As senhas não conferem!' });
        } else if (await User.findOne({ email })) {
            return res.status(400).json({ message: 'Email já cadastrado.' });
        }

        const user = await User.create({ fullName, email, password: hashedPassword });

        const newToken = await Token.create({ userId: user._id, token: jwt.sign({ email: user.email, _id: user._id }, process.env.JWT_SECRET) });

        const data = {
            userId: user._id,
            fullName: user.fullName,
            email: user.email
        }

        const link = `${frontendUrl()}/confirm-email?token=${newToken.token}`;
        console.log(link)
        sendEmail(user.email, 'Verificação de conta', { name: user.fullName, link: link }, '../utils/template/emailVerification.handlebars');
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const emailVerification = async (req, res) => {
    const tokenId = req.query.token;
    console.log(tokenId);
    try {
        const token = await Token.findOne({ token: tokenId });
        const userId = token.userId;
        if (!token) {
            return res.status(400).json({ message: 'Token inválido!' });
        }
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(400).json({ message: 'Usuário não encontrado! ' + user._id });
        }
        await User.updateOne({ _id: user._id }, { $set: { verified: true } });
        await token.deleteOne();

        res.status(200).json({ message: 'Email verificado com sucesso!' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && bcrypt.compareSync(password, user.password) && user.verified) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            return res.status(200).json({ message: 'Login realizado com sucesso!', token, id: user._id });
        } else {
            return res.status(400).json({ message: 'Email ou senha inválido.' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const requestResetPassword = async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: 'Email não cadastrado!' });
    }

    let token = await Token.findOne({ userId: user._id });

    if (token) {
        await token.deleteOne();
    }
    let resetToken = crypto.randomBytes(32).toString('hex');
    const hash = await bcrypt.hash(resetToken, 10);

    await Token.create({ userId: user._id, token: hash, createdAt: Date.now() });

    const link = `${frontendUrl()}/reset-password?token=${resetToken}&id=${user._id}`;
    sendEmail(user.email, 'Recuperação de senha', { name: user.fullName, link: link }, '../utils/template/requestResetPassword.handlebars');

    res.status(200).json({ message: 'Email enviado!' });
}

const resetPassword = async (req, res) => {
    const { id, token, password, confirmPassword } = req.body;
    let passwordResetToken = await Token.findOne({ userId: id });
    if (!passwordResetToken) {
        return res.status(400).json({ message: 'Token inválido ou expirado!' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'As senhas não conferem!' });
    }

    const isValid = bcrypt.compareSync(token, passwordResetToken.token);
    if (!isValid) {
        return res.status(400).json({ message: 'Token inválido ou expirado!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.updateOne(
        { _id: id },
        { $set: { password: hashedPassword } },
        { new: true }
    );

    const user = await User.findById({ _id: id });
    sendEmail(
        user.email,
        'Senha alterada',
        {
            name: user.fullName
        },
        '../utils/template/resetPassword.handlebars'
    );

    await passwordResetToken.deleteOne();
    res.status(200).json({ message: 'Senha alterada com sucesso!' });
}


export { registerUser, loginUser, requestResetPassword, resetPassword, emailVerification };