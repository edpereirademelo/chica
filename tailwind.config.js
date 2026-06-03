/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta extraída da logo da Marmitaria da Chica
        cream: '#FAF4E9', // fundo da app
        surface: '#FFFFFF', // cards / superfícies
        terracota: {
          DEFAULT: '#C8472A', // primária (panela)
          dark: '#A53A21', // hover / escura
        },
        ink: '#2E1B10', // texto principal (marrom escuro)
        muted: '#8A7866', // texto secundário
        peach: '#EFC987', // tom pêssego/tan (badges, destaques)
        leaf: '#5B7B4A', // verde (saladas/saudáveis)
        edge: '#EAE0CD', // bordas
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Baloo 2', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1rem',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(46,27,16,0.04), 0 4px 16px rgba(46,27,16,0.06)',
        card: '0 1px 3px rgba(46,27,16,0.05), 0 8px 24px rgba(46,27,16,0.05)',
      },
    },
  },
  plugins: [],
}
