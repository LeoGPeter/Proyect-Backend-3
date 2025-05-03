import { UserModel } from '../dao/models/User.js';
import bcrypt from 'bcrypt';

export const register = async (req, res) => {
    try {
      const { first_name, last_name, email, password } = req.body;
  
      if (!first_name || !last_name || !email || !password) {
        return res.status(400).json({ status: 'error', message: 'Faltan campos obligatorios' });
      }
  
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ status: 'error', message: 'El usuario ya existe' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = await UserModel.create({
        first_name,
        last_name,
        email,
        password: hashedPassword,
        role: 'user',
        pets: [],
        documents: [],
        last_connection: null,
      });
  
      res.status(201).json({ status: 'success', message: 'Usuario registrado', user: newUser });
    } catch (err) {
      req.logger?.error('Error en el registro', err);
      res.status(500).json({ status: 'error', message: 'Falló el registro' });
    }
  };

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user) {
    return res.status(401).json({ status: 'error', message: 'Usuario no encontrado' });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(401).json({ status: 'error', message: 'Contraseña incorrecta' });
  }

  user.last_connection = new Date();
  await user.save();

  req.session.user = {
    _id: user._id,
    email: user.email,
    role: user.role
  };

  res.status(200).json({ status: 'success', message: 'Login exitoso' });
};

export const logout = async (req, res) => {
  if (req.session?.user) {
    const user = await UserModel.findById(req.session.user._id);
    if (user) {
      user.last_connection = new Date();
      await user.save();
    }
  }

  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ status: 'error', message: 'No se pudo cerrar sesión' });
    }
    res.status(200).json({ status: 'success', message: 'Sesión finalizada' });
  });
};
