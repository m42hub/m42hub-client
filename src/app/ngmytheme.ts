import { definePreset } from '@primeng/themes';
import Lara from '@primeng/themes/lara';
import { text } from 'stream/consumers';

const lightSurface = {
  0: '#EEF3FF', // darkSurface[950]
  50: '#CEDAFC', // darkSurface[900]
  100: '#E8EEFF', // darkSurface[800]
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
  0: '#1E212C',
  50: '#202539',
  100: '#39497A',
  200: '#34416A',
  300: '#435EB8',
  400: '#4455EE',
  500: '#4455EE',
  600: '#7891EC',
  700: '#BFCBEE',
  800: '#E8EEFF',
  900: '#EEF3FF',
  950: '#EFEFEE',
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
          color: '#4455EE',
          inverseColor: '#1F1F1F',
          hoverColor: '#7891EC',
          activeColor: '#34416A',
        },
        highlight: {
          background: 'rgba(250, 250, 250, .08)',
          focusBackground: 'rgba(250, 250, 250, .12)',
          color: 'rgba(255, 255, 255, .87)',
          focusColor: 'rgba(255, 255, 255, .87)',
        },
        surface: darkSurface,
      },
    },
  },
};

export const NgMyTheme = definePreset(Lara, theme);
