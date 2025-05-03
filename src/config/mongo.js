import mongoose from 'mongoose';

export const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🔥 Conectado a MongoDB');
  } catch (err) {
    console.error('❌ Error al conectar a MongoDB:', err);
  }
};
