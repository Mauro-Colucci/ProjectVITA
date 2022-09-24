let btn = document.querySelector('.profile')
let wrapper = document.querySelector('.wrapper')

btn.addEventListener('click', ()=>{
    wrapper.classList.toggle('active')
})

//set the localstorage key pair to object and the stringified object "anActualObject"
//localStorage.setItem("object", JSON.stringify(anActualObject))
//grabs the value of object from the localstorage and saves it to obj
//const obj = JSON.parse(localStorage.getItem("object"))