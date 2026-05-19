import mongoose from 'mongoose';

const shortURLSchema = new mongoose.Schema({
  full_url: {
    type: String,
    required: true,
  },
  short_url: {
    type: String,
    unique: true,
    index: true,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: false,
  },
}, { timestamps: true });

const ShortURL = mongoose.model('ShortURL', shortURLSchema);

export default ShortURL;

// Q. What does { timestamps: true } do? 
// The { timestamps: true } option automatically adds 'createdAt' and 'updatedAt' fields to the schema, 
// which are managed by Mongoose and updated whenever a document is created or modified.