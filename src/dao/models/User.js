import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  password: String,
  role: String,
  pets: [String],
  documents: [
    {
      name: String,
      reference: String,
    },
  ],
  last_connection: Date,
});

export const UserModel = mongoose.model('User', userSchema);

