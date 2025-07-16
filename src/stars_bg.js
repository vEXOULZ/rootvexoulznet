
import noisejs from 'noisejs/index.js'

console.log(noisejs.Noise)

var noise = new noisejs.Noise()
noise.seed(Math.random());

export function freshDot(){

  var top = 100 * Math.random();
  var left = 100 * Math.random();
  var chance = (noise.perlin2(left/10, top/10) + 0.5) / 1.5;
  if (Math.random() > chance) return;

  var obj = document.createElement("div");
  obj.classList.add("star");
  obj.style.top = top + 'vh';
  obj.style.left = left + 'vw';

  var sequence = Math.random();
  var sizeMult = 1;

  if (sequence < 0.0000006) {
    obj.classList.add("sO");
    sizeMult = 6.6;
  } else if (sequence < 0.0024) {
    obj.classList.add("sB");
    sizeMult = 1.8;
  } else if (sequence < 0.0122) {
    obj.classList.add("sA");
    sizeMult = 1.4;
  } else if (sequence < 0.06) {
    obj.classList.add("sF");
    sizeMult = 1.15;
  } else if (sequence < 0.152) {
    obj.classList.add("sG");
    sizeMult = 0.96;
  } else if (sequence < 0.24) {
    obj.classList.add("sK");
    sizeMult = 0.7;
  } else {
    obj.classList.add("sM");
    sizeMult = 0.5;
  }

  obj.classList.add("twinkle");
  obj.style.animationDuration = (Math.random() * 5 + 1).toString() + "s";

  var size = Math.floor(2 * sizeMult * Math.random()) + 1;
  obj.style.height =  size + 'px';
  obj.style.width = size + 'px';
  
  document.body.appendChild(obj);
}

export function generateDots() {
  var size = 400;
  for(var i = 0 ; i < size; i++ ){
    new freshDot();
  }
}

export function setupBackground() {
    if (document.getElementsByClassName("star").length == 0) {
    generateDots();
    }
}