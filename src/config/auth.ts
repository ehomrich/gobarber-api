import dotenv from 'dotenv';

dotenv.config();

export default {
  jwt: {
    secret: `${process.env.SECRET_KEY}`,
    expiresIn: '10m',
  },
};
