import multer from 'multer';

// Guarda em memória, não em disco — vai direto pro Cloudinary
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB máximo
  fileFilter: (_, file, cb) => {
    const permitidos = ['image/jpeg', 'image/png', 'image/webp'];
    if (permitidos.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Apenas imagens JPG, PNG ou WEBP são permitidas'));
    }
  },
});

export default upload;