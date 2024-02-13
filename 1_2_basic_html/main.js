const btn = document.querySelector('.btn');
const cross = document.querySelector('.cross');
const rect = document.querySelector('.rect');

btn.addEventListener('click', ()=>{
  cross.style.fill = "white";
  rect.style.fill = "lime";
  btn.textContent = "Yup, you did it."
})