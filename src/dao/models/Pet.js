import mongoose from 'mongoose';

const petSchema = new mongoose.Schema({
  name: String,
  specie: String,
  age: Number,
  adopted: Boolean,
  owner: String,
});

export const PetModel = mongoose.model('Pet', petSchema);
