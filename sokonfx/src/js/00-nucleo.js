const el=id=>document.getElementById(id);
const stage=el('stage'), frames=16;
let seed=75823,playing=true,start=performance.now();
function generator(value){return ()=>{value=(Math.imul(value,1664525)+1013904223)>>>0;return value/4294967296}}
const profiles = {
 Impacto: {rimWidth:100,coreWidth:100,diameter:100, focus:0, riskWidth:100, outerWidth:100, particleWidth:100, shapes:1, styleMix:0, particles:32, light:75},
 Corte: {styleMix:0, particles:18, light:55},
 Projétil: {styleMix:0, particles:38, light:80},
 Fogo: {tint:'#ff651e',styleMix:60,particles:22,light:75},
 Água: {tint:'#229fde',styleMix:55,particles:32,light:35},
 'Pressão de ar': {tint:'#b8e8fa',styleMix:35,particles:12,light:18},
 'Ponto de luz': {tint:'#ffc96a',styleMix:30,particles:18,light:85},
 Fumaça: {tint:'#9699a4',styleMix:65,particles:16,light:0},
 Gosma: {tint:'#83c533',styleMix:70,particles:12,light:25}
};
