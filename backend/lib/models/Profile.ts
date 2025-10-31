import mongoose, { Schema, Document } from 'mongoose';

export interface IProfile extends Document {
  userId: string;
  title?: string;
  firstName?: string;
  middleName?: string;
  surname?: string;
  phone?: string;
  email?: string;
  state?: string;
  district?: string;
  tehsil?: string;
  assembly?: string;
  category?: string;
  politicalParty?: string | null;
  politicalPosition?: string | null;
  pic?: string | null;
  whatsapp?: string | null;
  website?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  twitter?: string | null;
  language?: 'en' | 'hindi' | 'marathi';
  localizedName?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProfileSchema = new Schema<IProfile>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    title: String,
    firstName: String,
    middleName: String,
    surname: String,
    phone: String,
    email: String,
    state: String,
    district: String,
    tehsil: String,
    assembly: String,
    category: String,
    politicalParty: String,
    politicalPosition: String,
    pic: String,
    whatsapp: String,
    website: String,
    instagram: String,
    facebook: String,
    twitter: String,
    language: { type: String, enum: ['en', 'hindi', 'marathi'], default: 'en' },
    localizedName: String,
  },
  { timestamps: true }
);

export const Profile = mongoose.model<IProfile>('Profile', ProfileSchema);
