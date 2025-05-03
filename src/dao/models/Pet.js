import mongoose from 'mongoose';

const petSchema = new mongoose.Schema({
  name: String,
  specie: String,
  age: Number,
  adopted: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: String,
    default: null,
  }
});

export const PetModel = mongoose.model('Pet', petSchema);

