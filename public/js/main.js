let btn = document.querySelector('.profile')
const wrapper = document.querySelector('.wrapper')
let sideNav = localStorage.getItem("sideNav");
const ctx = document.getElementById('myChart')//.getContext('2d');
const line = document.getElementById('lineChart')//.getContext('2d');


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





//this prevents the instantiation of chart in pages that do not have the canvas with the id listed above
if (ctx !== null && line !== null){
    ctx.getContext('2d');
    line.getContext('2d');

    const fetchDataForChart = async () => {
        try {
            const response = await fetch("/chart")
            const data = await response.json()

            const projectNames = data.project.map(ele => ele.projectName)
            const numberOfTasks = data.project.map(ele => ele.tasks.length)

            myChart.data.labels = projectNames
            myChart.data.datasets[0].data = numberOfTasks

            const userNames = data.user.map(user => user.userName)
            const tasksPerUser = data.user.map(user => user.assignedTasks.length)

            lineChart.data.labels = userNames
            lineChart.data.datasets[0].data = tasksPerUser
            

        } catch (err) {
            console.error(err)
        } 
    }

    fetchDataForChart()

    const myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: [],
            datasets: [{
                label: '# of Votes',
                data: [],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true
        }
    });

    const lineChart = new Chart(line, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Tasks assigned',
                data: [],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
                },
                //can add more datasets in the array, so I can plot multiple datasets in the same graph
            ]
        },
        options: {
            responsive: true,
            scales:{
                y: {
                    //y axis begin at 0
                    beginAtZero: true,
                    ticks: {
                        //Achieved integers for Y axis
                        precision: 0
                    }
                }
            }
        }
    });
}
