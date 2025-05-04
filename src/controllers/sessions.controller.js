import { UserModel } from '../dao/models/User.js';
import bcrypt from 'bcryptjs';

export const register = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
      req.logger.warning('Faltan campos en el registro');
      return res.status(400).json({ status: 'error', message: 'Faltan campos obligatorios' });
    }

    if (!email.includes('@')) {
      req.logger.warning('Email inválido en el registro');
      return res.status(400).json({ status: 'error', message: 'Email inválido' });
    }

    if (password.length < 6) {
      req.logger.warning('Password demasiado corta');
      return res.status(400).json({ status: 'error', message: 'Password demasiado corta' });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      req.logger.http(`Registro fallido: email ${email} ya registrado`);
      return res.status(409).json({ status: 'error', message: 'El email ya está registrado' });
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

    req.logger.info(`Nuevo usuario registrado: ${email}`);
    return res.status(201).json({
      status: 'success',
      message: 'Usuario registrado',
      user: newUser
    });

  } catch (err) {
    req.logger.error('Error en el registro', err);
    res.status(500).json({ status: 'error', message: 'Error del servidor' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      req.logger?.warning('Faltan email o contraseña');
      return res.status(400).json({ status: 'error', message: 'Email y contraseña requeridos' });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      req.logger?.warning(`Login fallido: email no encontrado - ${email}`);
      return res.status(401).json({ status: 'error', message: 'Usuario no encontrado' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      req.logger?.warning(`Login fallido: contraseña incorrecta - ${email}`);
      return res.status(401).json({ status: 'error', message: 'Contraseña incorrecta' });
    }

    user.last_connection = new Date();
    await user.save();

    req.session.user = {
      _id: user._id,
      email: user.email,
      role: user.role
    };

    req.logger?.info(`Usuario logueado: ${email}`);
    res.status(200).json({ status: 'success', message: 'Login exitoso' });
  } catch (error) {
    req.logger?.error('Error en login', error);
    res.status(500).json({ status: 'error', message: 'Error del servidor' });
  }
};

export const logout = async (req, res) => {
  try {
    if (req.session?.user) {
      const user = await UserModel.findById(req.session.user._id);
      if (user) {
        user.last_connection = new Date();
        await user.save();
        req.logger?.info(`Usuario deslogueado: ${user.email}`);
      }
    }

    req.session.destroy(err => {
      if (err) {
        req.logger?.error('Error al cerrar sesión', err);
        return res.status(500).json({ status: 'error', message: 'No se pudo cerrar sesión' });
      }
      res.status(200).json({ status: 'success', message: 'Sesión finalizada' });
    });
  } catch (error) {
    req.logger?.error('Error en logout', error);
    res.status(500).json({ status: 'error', message: 'Error del servidor' });
  }
};
