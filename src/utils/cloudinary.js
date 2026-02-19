import { Cloudinary } from '@cloudinary/url-gen';

export const cld = new Cloudinary({
  cloud: {
    // Uses the demo cloud by default so you can see it working immediately.
    // Replace 'demo' in your .env file with your actual Cloudinary Cloud Name.
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo'
  }
});
