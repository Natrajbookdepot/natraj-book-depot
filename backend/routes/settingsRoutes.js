const router = require('express').Router();

const settings = {
  logoUrl: '/images/logo.png',
  navLinks: [
    { label: 'Home',    path: '/' },
    { label: 'Shop',    path: '/shop' },
    { label: 'About',   path: '/about' },
    { label: 'Contact', path: '/contact' }
  ],
  footer: {
    description: 'Delivering trusted educational and office supplies with competitive pricing, fast service, and 25+ years of excellence.',
    contact: {
      phone: '+91-9936779243',
      email: 'bookdepotnatraj@gmail.com',
      hours: 'Mon–Sun 9am–9pm'
    }
  }
};

router.get('/', (_req, res) => {
  res.json(settings);
});

module.exports = router;
