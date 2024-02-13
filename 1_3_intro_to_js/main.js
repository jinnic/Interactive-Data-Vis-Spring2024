const btn = document.querySelector('.btn');
const counter = document.querySelector('#counter');
const x = document.querySelector('#x');
const y = document.querySelector('#y');
const objectStored = document.querySelector('#objectStored');
let clickCoordinates = [];
let count = 0;

btn.addEventListener('click', (event)=>{
  let canvas = btn.getBoundingClientRect(); 
  let positionX = event.clientX - canvas.left;
  let positionY = event.clientY - canvas.top
  let currentCoordinate = {
    x: 0,
    y: 0
  };
  
  count += 1;
  counter.textContent = count;
  x.textContent = positionX;
  y.textContent = positionY;
  // console.log('Cursor position: ' + positionX + ',' + positionY)

  currentCoordinate.x = positionX;
  currentCoordinate.y = positionY;
  clickCoordinates.push(currentCoordinate);

  objectStored.innerHTML = JSON.stringify(clickCoordinates);

  console.log(clickCoordinates)
})


