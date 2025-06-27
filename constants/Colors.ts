/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#8B5CF6'; // Roxo galáctico
const tintColorDark = '#A855F7'; // Roxo mais claro

export const Colors = {
  light: {
    text: '#E5E7EB',
    background: '#0F0F23', // Azul escuro espacial
    tint: tintColorLight,
    icon: '#6B7280',
    tabIconDefault: '#6B7280',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#F3F4F6',
    background: '#000011', // Preto espacial
    tint: tintColorDark,
    icon: '#9CA3AF',
    tabIconDefault: '#9CA3AF',
    tabIconSelected: tintColorDark,
  },
};