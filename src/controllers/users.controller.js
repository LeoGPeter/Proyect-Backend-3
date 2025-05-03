import { UserModel } from '../dao/models/User.js';

export const uploadDocuments = async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await UserModel.findById(uid);
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
    }

    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ status: 'error', message: 'No se subieron archivos' });
    }

    const docsToAdd = files.map((file) => ({
      name: file.originalname,
      reference: file.path,
    }));

    user.documents.push(...docsToAdd);
    await user.save();

    res.status(200).json({ status: 'success', message: 'Documentos subidos', documents: user.documents });
  } catch (err) {
    req.logger?.error('Error al subir documentos', err);
    res.status(500).json({ status: 'error', message: 'Falló la carga de documentos' });
  }
};
