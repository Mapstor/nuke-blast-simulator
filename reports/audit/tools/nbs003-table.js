const YK=[1,20,1000,20000];
const T={p20:[0.2,0.6,2.4,6.4],p5:[0.6,1.7,6.2,17],p1:[1.7,4.7,17,47],t3:[0.6,2.5,12,38]};
function interp(vals,W){const lx=YK.map(Math.log),ly=vals.map(Math.log),lw=Math.log(W);let i=0;if(lw<=lx[0])i=0;else if(lw>=lx[3])i=2;else{while(i<2&&lw>lx[i+1])i++;}const t=(lw-lx[i])/(lx[i+1]-lx[i]);return Math.exp(ly[i]+t*(ly[i+1]-ly[i]));}
const fmt=k=>k>=10?k.toFixed(1):k.toFixed(2);
const yields=[[15,'Little Boy 15 kt'],[21,'Fat Man 21 kt'],[100,'W76 100 kt'],[1200,'B83 1.2 Mt'],[50000,'Tsar Bomba 50 Mt']];
console.log('weapon | metric | OLD | NEW');
for(const [W,name] of yields){
  const oldFB=0.145*W**0.4, newFB=0.061*W**0.4;
  const o20=0.482*W**0.33, o5=1.03*W**0.33, o1=2.93*W**0.33, o3=0.67*W**0.41;
  console.log(`${name} | fireball | ${fmt(oldFB)} | ${fmt(newFB)}`);
  console.log(`${name} | 20 psi | ${fmt(o20)} | ${fmt(interp(T.p20,W))}`);
  console.log(`${name} | 5 psi | ${fmt(o5)} | ${fmt(interp(T.p5,W))}`);
  console.log(`${name} | 1 psi | ${fmt(o1)} | ${fmt(interp(T.p1,W))}`);
  console.log(`${name} | 3rd-deg | ${fmt(o3)} | ${fmt(interp(T.t3,W))}`);
}
