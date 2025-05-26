import type { Config } from "tailwindcss";
const plugin = require("tailwindcss/plugin");
const { default: flattenColorPalette } = require("tailwindcss/lib/util/flattenColorPalette");

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        initial: "initial",
        inherit: "inherit"
      },
      colors: {
        nobleBlack: {
          100: "#E8E9E9",
          200: "#CDCECF",
          300: "#9B9C9E",
          400: "#686B6E",
          500: "#363A3D",
          600: "#1A1D21",
          700: "#131619",
          800: "#0D0F10",
          900: "#060708",
        },
        dayBlue: {
          100: "#EBEDFC",
          200: "#D2D8F9",
          300: "#A6B0F2",
          400: "#7989EC",
          500: "#4D62E5",
          600: "#3045C9",
          700: "#243497",
          800: "#182364",
          900: "#0C1132",
        },
        purpleBlue: {
          100: "#F0E8FD",
          200: "#DECCFB",
          300: "#BD9AF8",
          400: "#9C67F4",
          500: "#7C35F1",
          600: "#5F18D4",
          700: "#47129F",
          800: "#300C6A",
          900: "#180635",
        },
        sunglow: {
          100: "#FFFAEA",
          200: "#FFF3D1",
          300: "#FFE8A3",
          400: "#FFDC75",
          500: "#FFD147",
          600: "#E2B42B",
          700: "#AA8720",
          800: "#715A15",
          900: "#392D0B",
        },
        stemGreen: {
          100: "#F7FDF4",
          200: "#EDFBE6",
          300: "#DBF7CD",
          400: "#C8F4B4",
          500: "#B6F09C",
          600: "#9AD37F",
          700: "#739F5F",
          800: "#4D6A3F",
          900: "#263520",
        },
        heisenbergBlue: {
          100: "#F1FBFE",
          200: "#E0F6FD",
          300: "#C0EDFB",
          400: "#A1E4F9",
          500: "#82DBF7",
          600: "#65BEDA",
          700: "#4C8FA4",
          800: "#335F6D",
          900: "#193037",
          effect: "#84DCF5",
        },
        happyOrange: {
          100: "#FFF2E9",
          600: "#E26F20",
          900: "#391C08",
        },
        electricGreen: {
          100: "#F3FBF7",
          600: "#4AC97E",
          900: "#122B1D",
        },
        redPower: {
          100: "#FBECEC",
          600: "#D0302F",
          900: "#2F0F0E",
        },
        glass: "#D7EDED"
      },
      boxShadow:({theme}) => ({
        "3xl": "0 0 " + theme("spacing.12") + " #FFF",
        "glass-modal" : "16px 24px 64px -24px rgba(255, 255, 255, 0.04) inset, 0px 24px 64px -16px rgba(0, 0, 0, 0.24), 0px 8px 12px 0px rgba(255, 255, 255, 0.04) inset",
        "glass-effect": "16px 24px 64px -24px rgba(255, 255, 255, 0.08) inset, 0px 24px 24px -16px rgba(0, 0, 0, 0.12), 0px 8px 12px 0px rgba(255, 255, 255, 0.08) inset",
      }),
      dropShadow: ({theme}) => ({
        ...theme('boxShadow')
      }),
      opacity: {
        "8": ".08",
        "16": ".16",
        "24": ".24",
        "48": ".48",
        "64": ".64",
        "96": ".96"
      },
      animation:{
        "wave": "wave 1s linear infinite",
        "jumpUp": "jumpUp .6s linear 1",
        "jumpUpToWave": "jumpUp 0.6s linear 1, wave 1s linear 1.8s infinite" ,
        "notify": "notify 2s linear forwards"
      },
      keyframes: ({ theme }) => ({
        jumpUp: {
          "50%": {
            transform: 'translateY(-200%)'
          },
          "0%, 100%": { // Fixed the keyframes to use "0%, 100%" instead of "0,100%"
            transform: 'translateY(0)'
          }
        },
        wave: {
          "50%": {
            height: "28px",
            background: theme("colors.stemGreen.500")
          },
          "0%, 100%": { // Fixed the keyframes to use "0%, 100%" instead of "0%,100%"
            height: "6px",
            background: theme("colors.stemGreen.300")
          }
        },
        notify: {
          "0%": {
            transform: 'translateX(100%)'
          },
          "25%": {
            transform: 'translateX(0)'
          },
          "75%": {
            opacity: '1'
          },
          "100%": {
            opacity: '0'
          }
        }
      }),
      spacing: ({ theme }) => ({
        ...theme("screens"),
        1: "1px",
        1.5: "1.5px",
        2: "2px",
        3: "3px",
        4: "4px",
        5: "5px",
        6: "6px",
        7: "7px",
        8: "8px",
        9: "9px",
        10:"10px",
        12: "12px",
        14: "14px",
        16: "1rem",
        20: "20px",
        22: "22px",
        24: "24px",
        30: "30px",
        32: "32px",
        40: "40px",
        48: "48px",
        52: "52px",
        64: "4rem",
        100: "100px",
        360: "90rem",
      }),
      width: {
        "fill-available": "-webkit-fill-available",
      },
      height: {
        "fill-available": "-webkit-fill-available",
      },
      borderWidth: ({ theme }) => ({
        ...theme("spacing"),
        1: "1px",
      }),
      borderRadius: ({ theme }) => ({
        ...theme("spacing"),
      }),
      fontSize: {
        "heading-xl": [
          "36px",
          {
            lineHeight: "44px",
            letterSpacing: "0",
          },
        ],
        "heading-l": [
          "32px",
          {
            lineHeight: "40px",
            letterSpacing: "0",
          },
        ],
        "heading-m": [
          "28px",
          {
            lineHeight: "36px",
            letterSpacing: "0",
          },
        ],
        "heading-s": [
          "24px",
          {
            lineHeight: "32px",
            letterSpacing: "0",
          },
        ],
        "heading-xs": [
          "20px",
          {
            lineHeight: "28px",
            letterSpacing: "0",
          },
        ],
        "body-xl": [
          "18px",
          {
            lineHeight: "28px",
            letterSpacing: "0.15px",
          },
        ],
        "body-l": [
          "16px",
          {
            lineHeight: "24px",
            letterSpacing: "0.15px",
          },
        ],
        "body-m": [
          "14px",
          {
            lineHeight: "20px",
            letterSpacing: "0.15px",
          },
        ],
        "body-s": [
          "12px",
          {
            lineHeight: "18px",
            letterSpacing: "0.15px",
          },
        ],
      },
      backgroundImage: ({ theme }) => ({
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
          
        "glass-fill": "linear-gradient(118deg, rgba(215, 237, 237, 0.16) -47.79%, rgba(204, 235, 235, 0.00) 100%)",

        "green-blue-dayBlue.600":
          "linear-gradient(225deg," +
          theme("colors.dayBlue.600") +
          " 0%," +
          theme("colors.heisenbergBlue.600") +
          " 45.31%," +
          theme("colors.stemGreen.600") +
          " 100%)",

        "dayBlue-blue-green.600":
          "linear-gradient(45deg," +
          theme("colors.dayBlue.600") +
          " 0%," +
          theme("colors.heisenbergBlue.600") +
          " 45.31%," +
          theme("colors.stemGreen.600") +
          " 100%)",

        "green-blue-dayBlue.500":
          "linear-gradient(225deg," +
          theme("colors.dayBlue.500") +
          " 0%," +
          theme("colors.heisenbergBlue.500") +
          " 45.31%," +
          theme("colors.stemGreen.500") +
          " 100%)",

        "dayBlue-blue-green.500":
          "linear-gradient(45deg," +
          theme("colors.dayBlue.500") +
          " 0%," +
          theme("colors.heisenbergBlue.500") +
          " 45.31%," +
          theme("colors.stemGreen.500") +
          " 100%)",

        "blue-green.500":
          "linear-gradient(45deg," +
          theme("colors.heisenbergBlue.500") +
          " 0," +
          theme("colors.stemGreen.500") +
          " 100%)",

        "green-blue.500":
          "linear-gradient(225deg," +
          theme("colors.heisenbergBlue.500") +
          " 0," +
          theme("colors.stemGreen.500") +
          " 100%)",
      }),
    },
  },
  plugins: [
    plugin(function({ matchUtilities, theme } :any) {
      matchUtilities(
        {
          'drop-shadow-multiple': (value : any) => ({
            '--tw-color': value,
            filter: [
              `drop-shadow(0px 4px 6px var(--tw-color))`,
              `drop-shadow(0px 10px 15px var(--tw-color))`
            ].join(' '),
          }),
        },
        { 
          values: flattenColorPalette(theme("colors")), 
          type: "color" 
        }
      );
    }),
    plugin(function({ matchUtilities, theme } : any) {
      matchUtilities(
        {
          'size-text': (value : any) => ({
            fontSize: value,
          }),
        },
        { values: theme('fontSize') } 
      );
    
      matchUtilities(
        {
          'animate-delay': (value : any) => ({
            animationDelay: value,
          }),
        },
        { values: theme('transitionDelay') }
      );
    }),
    require('@tailwindcss/container-queries')
  ],
};
export default config;
