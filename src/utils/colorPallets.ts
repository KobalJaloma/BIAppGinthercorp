export const colores = {
  primary: '#1b47c3',
  secondary: '#f4f4f4',
  primaryDark: '#0D265E',
  secondaryDark: '#AFAFAF',
  textPrimary: '#23303f',
  textSecondary: '#f4f4f4',
  darkBorder: '#AFAFAF',
  success: '#34d67d',
  fail: '#bf0603'
}


export const chartPallete = {
  blue: ['#03045e','#0077b6','#00b4d8','#90e0ef','#caf0f8','#A1CEB4'],
  bluePink: ['#f72585','#b5179e','#7209b7','#560bad','#480ca8','#3a0ca3','#3f37c9','#4361ee','#4895ef','#4cc9f0'],
  cyan: ['#DAD2D8','#143642','#0F8B8D','#EC9A29','#A8201A']
}

//ASEGURAR A TS DE QUE LA KEY SE ENCUENTRA EXISTENTE
type ChartPalleteName = keyof typeof chartPallete;

export const randomColor = (name:ChartPalleteName) => {

  const pallete = chartPallete[name];

  return pallete[Math.round(Math.random() * (pallete.length-1))];
} 
