
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';

const getUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id, '-password');
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateUser = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }
        if (req.body.email) {
            const email = await User.findOne({ email: req.body.email });
            if (email) {
                return res.status(400).json({ message: 'Email já cadastrado.' });
            }
        }
        if (req.body.password && req.body.confirmPassword) {
            if (req.body.password !== req.body.confirmPassword) {
                return res.status(400).json({ message: 'As senhas não conferem.' });
            }
            req.body.password = await bcrypt.hash(req.body.password, 10);
        } else if (req.body.password && !req.body.confirmPassword) {
            delete req.body.password;
            return res.status(400).json({ message: 'Confirme a senha.' });
        }

        await User.findByIdAndUpdate(id, req.body, { new: true });

        const data = { 
            fullName: req.body.fullName || user.fullName,
            email: req.body.email || user.email
        }
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export { getUser, updateUser };