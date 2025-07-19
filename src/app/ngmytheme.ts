import { definePreset } from '@primeng/themes';
import Lara from '@primeng/themes/lara';

const lightSurface = {
  0: '#EEF3FF', // darkSurface[950]
  50: '#DBE5FF', // darkSurface[900]
  100: '#D3D9EC', // darkSurface[800]
  200: '#BFCBEE', // darkSurface[700]
  300: '#7891EC', // darkSurface[600]
  400: '#4455EE', // darkSurface[500]
  500: '#4455EE', // darkSurface[400]
  600: '#435EB8', // darkSurface[300]
  700: '#34416A', // darkSurface[200]
  800: '#39497A', // darkSurface[100]
  900: '#1E212C', // darkSurface[50]
  950: '#1F1F1F', // darkSurface[0]
};

const darkSurface = {
  0: '#1F1F1F',    // Preto mais profundo
  50: '#2A2A2A',   // Cinza muito escuro
  100: '#3A3A3A',  // Cinza escuro
  200: '#39497A',  // Cinza médio-escuro
  300: '#1E212C',  // Cinza médio
  400: '#6A6A6A',  // Cinza médio-claro
  500: '#4455EE',  // Cor primária (mantida)
  600: '#5A6BFF',  // Primária mais clara
  700: '#7A8BFF',  // Primária ainda mais clara
  800: '#7891EC',  // Primária bem clara
  900: '#D3D9EC',  // Primária muito clara
  950: '#EEF3FF',  // Branco (mantido)
};

const primary = {
  50: '#EFEFEE',   // darkSurface[900]
  100: '#EEF3FF',   // darkSurface[800]
  200: '#E8EEFF',   // darkSurface[700]
  300: '#BFCBEE',   // darkSurface[600]
  400: '#7891EC',   // darkSurface[500]
  500: '#4455EE',   // darkSurface[400]
  600: '#435EB8',   // darkSurface[300]
  700: '#34416A',   // darkSurface[200]
  800: '#39497A',   // darkSurface[100]
  900: '#1E212C',   // darkSurface[50]
  950: '#1F1F1F',   // darkSurface[0]
}

let theme = {
  semantic: {
    primary: primary,
    surface: lightSurface,
    colorScheme: {
      light: {
        primary: {
          color: '#4455EE',
          inverseColor: '#1F1F1F',
          hoverColor: '#7891EC',
          activeColor: '#34416A',
        },
        highlight: {
          background: '#E8EEFF',
          focusBackground: '#BFCBEE',
          color: '#1E212C',
          focusColor: '#1E212C',
        },
        surface: lightSurface,
      },
      dark: {
        primary: {
          color: '#4455EE',        // Mantém a cor original
          inverseColor: '#EEF3FF', // Branco para contraste
          hoverColor: '#5A6BFF',   // Hover um pouco mais claro
          activeColor: '#7A8BFF',  // Active mais claro
        },
        highlight: {
          background: '#2A2A2A',   // Cinza escuro neutro
          focusBackground: '#3A3A3A', // Cinza médio-escuro
          color: '#EEF3FF',        // Branco para texto
          focusColor: '#9AABFF',   // Azul claro para foco
        },
        surface: darkSurface,
      },
    },
  },
};

export const NgMyTheme = definePreset(Lara, theme);
