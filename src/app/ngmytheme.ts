import { definePreset } from '@primeng/themes';
import Lara from '@primeng/themes/lara';

const lightSurface = {
  0: '#E0E9FF', // Branco azulado muito claro
  50: '#DBE5FF', // Azul muito claro
  100: '#D3D9EC', // Azul claro acinzentado
  200: '#BFCBEE', // Azul claro
  300: '#7891EC', // Azul médio
  400: '#4455EE', // Azul intenso (primário)
  500: '#4455EE', // Azul intenso (primário)
  600: '#435EB8', // Azul escuro
  700: '#34416A', // Azul muito escuro
  800: '#39497A', // Azul acinzentado escuro
  900: '#1E212C', // Cinza quase preto
  950: '#1F1F1F', // Preto
};

const darkSurface = {
  0: '#1F1F1F', // Preto mais profundo
  50: '#2A2A2A', // Cinza muito escuro
  100: '#3A3A3A', // Cinza escuro
  200: '#39497A', // Cinza médio-escuro
  300: '#1E212C', // Cinza médio
  400: '#20284C', // Cinza médio-claro
  500: '#4455EE', // Cor primária (mantida)
  600: '#5A6BFF', // Primária mais clara
  700: '#7A8BFF', // Primária ainda mais clara
  800: '#7891EC', // Primária bem clara
  900: '#D3D9EC', // Primária muito clara
  950: '#EEF3FF', // Branco (mantido)
};

const primary = {
  50: '#EFEFEE', // Cinza muito claro
  100: '#EEF3FF', // Branco azulado muito claro
  200: '#E8EEFF', // Azul muito claro
  300: '#BFCBEE', // Azul claro
  400: '#7891EC', // Azul médio
  500: '#4455EE', // Azul intenso (primário)
  600: '#435EB8', // Azul escuro
  700: '#34416A', // Azul muito escuro
  800: '#39497A', // Azul acinzentado escuro
  900: '#1E212C', // Cinza quase preto
  950: '#1F1F1F', // Preto
};

let theme = {
  semantic: {
    primary: primary,
    surface: lightSurface,
    colorScheme: {
      light: {
        primary: {
          color: '#4455EE', // Azul intenso (primário)
          inverseColor: '#1F1F1F', // Preto (para contraste)
          hoverColor: '#7891EC', // Azul médio (hover)
          activeColor: '#34416A', // Azul muito escuro (ativo)
        },
        highlight: {
          background: '#E8EEFF', // Azul muito claro (fundo de destaque)
          focusBackground: '#BFCBEE', // Azul claro (fundo de foco)
          color: '#1E212C', // Cinza quase preto (texto)
          focusColor: '#1E212C', // Cinza quase preto (texto em foco)
        },
        surface: lightSurface,
      },
      dark: {
        primary: {
          color: '#4455EE', // Azul intenso (primário)
          inverseColor: '#EEF3FF', // Branco azulado muito claro (para contraste)
          hoverColor: '#5A6BFF', // Azul claro (hover)
          activeColor: '#7A8BFF', // Azul ainda mais claro (ativo)
        },
        highlight: {
          background: '#2A2A2A', // Cinza escuro neutro
          focusBackground: '#3A3A3A', // Cinza médio-escuro
          color: '#EEF3FF', // Branco para texto
          focusColor: '#9AABFF', // Azul claro para foco
        },
        surface: darkSurface,
      },
    },
  },
};

export const NgMyTheme = definePreset(Lara, theme);
