let btn = document.querySelector('.profile')
const wrapper = document.querySelector('.wrapper')
let sideNav = localStorage.getItem("sideNav");


const activeSidenav = () => {
    wrapper.classList.add("active");
    localStorage.setItem("sideNav", "active")
}
const inactiveSidenav = () => {
    wrapper.classList.remove("active");
    localStorage.setItem("sideNav", "")
}

//this is equivalent to if(sideNave==='active) {activeSidenav()}
(sideNav === "active") && activeSidenav()


//need to incorporate an object for localStorage to manage themes.

btn.addEventListener('click', () => {
    sideNav = localStorage.getItem("sideNav")
    sideNav? inactiveSidenav():activeSidenav()
});
