export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        needleebg: '#B7C9FF',
        blobIndigo: 'rgba(86, 76, 255, 0.5)',
        blobIndigoContrast: '#483dff',
        blobLavender: 'rgba(188, 162, 255, 0.7)',
        blobLavenderContrast: '#933bff',
        blobSteel: 'rgba(130, 170, 255, 0.8)',
        blobSteelContrast: '#3d9eff',
        blobIce: 'rgba(203, 225, 255, 0.23)',
        blobCloud: 'rgba(255, 255, 255, 0.43)',
      },
      keyframes: {
        blob1: {
          '0%': { transform: 'translate(-10vw, -80vh) scale(1)' },
          '25%': { transform: 'translate(40vw, -20vh) scale(1.2)' },
          '50%': { transform: 'translate(80vw, 60vh) scale(0.9)' },
          '75%': { transform: 'translate(-40vw, 70vh) scale(1.1)' },
          '100%': { transform: 'translate(-10vw, -80vh) scale(1)' },
        },
        blob2: {
          '0%': { transform: 'translate(50vw, 10vh) scale(0.95)' },
          '25%': { transform: 'translate(10vw, -40vh) scale(1.1)' },
          '50%': { transform: 'translate(-30vw, 20vh) scale(1.05)' },
          '75%': { transform: 'translate(40vw, 30vh) scale(1)' },
          '100%': { transform: 'translate(50vw, 10vh) scale(0.95)' },
        },
        blob3: {
          '0%': { transform: 'translate(0vw, 0vh) scale(1)' },
          '20%': { transform: 'translate(60vw, -60vh) scale(1.2)' },
          '40%': { transform: 'translate(-40vw, 40vh) scale(0.85)' },
          '60%': { transform: 'translate(30vw, 20vh) scale(1.1)' },
          '80%': { transform: 'translate(-10vw, -50vh) scale(0.95)' },
          '100%': { transform: 'translate(0vw, 0vh) scale(1)' },
        },
        blob4: {
          '0%': { transform: 'translate(-20vw, 20vh) scale(1)' },
          '25%': { transform: 'translate(30vw, 30vh) scale(1.2)' },
          '50%': { transform: 'translate(-50vw, -20vh) scale(0.9)' },
          '75%': { transform: 'translate(40vw, -40vh) scale(1.1)' },
          '100%': { transform: 'translate(-20vw, 20vh) scale(1)' },
        },
        blob5: {
          '0%': { transform: 'translate(10vw, -10vh) scale(1.1)' },
          '20%': { transform: 'translate(-60vw, 50vh) scale(1)' },
          '40%': { transform: 'translate(30vw, -30vh) scale(1.15)' },
          '60%': { transform: 'translate(-40vw, 60vh) scale(0.85)' },
          '80%': { transform: 'translate(60vw, -50vh) scale(1)' },
          '100%': { transform: 'translate(10vw, -10vh) scale(1.1)' },
        },       
        pulseBlur: {
          '0%':   { transform: 'scale(1)',   opacity: '0.4', filter: 'blur(0px)' },
          '50%':  { transform: 'scale(1.5)', opacity: '0.7', filter: 'blur(6px)' },
          '100%': { transform: 'scale(1)',   opacity: '0.4', filter: 'blur(0px)' }
        }
      },
      animation: {
        blob1: "blob1 50s infinite ease-in-out",
        blob2: "blob2 60s infinite ease-in-out",
        blob3: "blob3 55s infinite ease-in-out",
        blob4: "blob4 48s infinite ease-in-out",
        blob5: "blob5 62s infinite ease-in-out",
        pulseBlur: "pulseBlur 1.8s ease-in-out infinite"
      },
    },
  },
  safelist: [
    'animate-blob1',
    'animate-blob2',
    'animate-blob3',
    'animate-blob4',
    'animate-blob5',
    'bg-needleebg',
    'animate-pulseBlur'
  ],
  plugins: [],
}
