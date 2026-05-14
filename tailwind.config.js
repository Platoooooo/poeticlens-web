/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        guGong: '#8b2c2c',      // 故宫红
        xuanZhi: '#f5f0e8',     // 宣纸色
        moSe: '#2c2c2c',        // 墨色
        yinZhu: '#d4af37',      // 印珠金
        fengYe: '#a83c3c',      // 枫叶红
      },
      fontFamily: {
        wenkai: ['"LXGW WenKai"', 'serif'],
      },
    },
  },
  plugins: [],
}
