/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        glass: {
          DEFAULT: 'rgba(255, 255, 255, 0.05)',
          dark: 'rgba(0, 0, 0, 0.2)',
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'noise': "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwBAMAAAClLOS0AAAAElBMVEUAAAD8/vz08vT09vT8+vzs7uxH16TeAAAAAXRSTlMAQObYZgAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAuFJREFUOI0Vk+3NLiEIRG1B8ClQqBYYKlsLhsq2wlDZUPD0/5db5DPeCfwYmcPMed8XEbsCUxXlpo5G9wVMTSjEOv3mE+1v+q0eUBdQFaCZwHPoZqvlzlUF1B/P0w+2GbzXxoD6AP2B5P17j3c+UPfx+o0B7gC82weU9xrLRHVCGaAfj/x5Tqhs/m6G6gLWA3TfMV/5/jBAH+Bv9z5L+LL3Zq4p2PQxQP/x8TwvxhQ/mwH9gBDgrbx0qCEVHQOEAP0G2DyhRi/2GKAPCIHh5sNyP9BHAFzXgRCAfuFVG7iOAaoHhAAt3m6G6wLWA6LB8fZj9QKq9xiA/vm4GyCVnpgiBqwERANzq4+9hdR5PMBYQDQw1+5hJ4i1G6AaEA2u1/o4OhC9xwNUFxANiCVHo5pLBswRkM52wF0UIP7ZvQFzBLSlA0QGPzNAXcAeAe3pAJEBxwNUA6IBIWL5Z3pA9B4PUF1ANLAkH6zPGBBHQDs6IGZTkwHqAOqEdobAkdR1DFAHsEfA3WQGiAzUHhANrMkHp2uNs/UAswNUAyIYQ/KBDJgjoB0dIDLQe0AIsIQ/d4DIQOwB0YAQ/FWpYwDqB9wR0H4OEEGPuY4B6gNUE1juj/w5A3IEtKUDRAbnHqAuYI+A9nSAyOB4gGqACEb/Y3pA9B4PUF1ANLBf99RkDIgjIDLgYQ4QB7B6/8F1dMCzbSzbdW5nv16dGwb4b984F3RwZOhvqOhgVfs3oIbL/j4/XMd+3j3oY4Ae4LxUQl9Xw/9hQAyQCmhbFwZej2xwRFMAa72ApQNUB1jD5tbz9UNvrZ/1ATpA5P5X3dPHALqPBpj9h0rKA/r5ED8bANUedwC4p3sLUAEiUAeA+h2o3VCtd+Lu9wHvAr4XSbhSV/fxwC0HxAC8JuT6LZ5/pR+4LjP4p3SKr/wDHkXtkYGP6IAAAAAASUVORK5CYII=')",
      }
    },
  },
  plugins: [],
};