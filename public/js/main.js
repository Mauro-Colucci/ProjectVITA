let btn = document.querySelector('.profile')
const wrapper = document.querySelector('.wrapper')
let sideNav = localStorage.getItem("sideNav");
const ctx = document.getElementById('myChart')//.getContext('2d');
const line = document.getElementById('barChart')//.getContext('2d');


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

            //grabs projects with publish true, filtering out projects without tasks
            const publicProjects = data.project.filter(project => project.publish && project.tasks.length)

            const projectNames = publicProjects.map(ele => ele.projectName)
            //const numberOfTasks = publicProjects.map(ele => ele.tasks.length)

            //removing the completed tasks from the publicProjects array
            for(let i=0; i<publicProjects.length; i++){
                for(let key of publicProjects){
                    key.tasks = key.tasks.filter(task=> task.status !=='closed')
                }
            }
            const numberOfTasks = publicProjects.map(ele => ele.tasks.length)

            myChart.data.labels = projectNames
            myChart.data.datasets[0].data = numberOfTasks
            myChart.update()

            //array of users, filtering out users with no tasks or projects
            const userNames = data.user.filter(ele=> ele.assignedTasks.length && ele.createdProjects.length).map(user => user.userName)
            //number of tasks open (not closed) per user
            const tasksPerUser = data.user.map(user => user.assignedTasks.filter(ele=> ele.status !== 'closed').length)
            const closedTasks =  data.user.map(user => user.assignedTasks.filter(ele=> ele.status === 'closed').length)
            const projectsPerUser = data.user.map(user => user.createdProjects.length)

            barChart.data.labels = userNames
            barChart.data.datasets[0].data = tasksPerUser
            barChart.data.datasets[1].data = projectsPerUser
            barChart.data.datasets[2].data = closedTasks
            barChart.update()
            
           /*  const arr = data.project.map(ele=> [ele.user.userName, ele.projectName])
            const entry = arr.map(a=>Object.fromEntries([a]))
            const userProjectObj = entry.reduce((prv, cur) => {
            Object.entries(cur).forEach(([key, v]) => key in prv ? prv[key].push(v) : (prv[key] = [v]));
            return prv;
            }, {})

            let projectsPerUser = []

            userNames.forEach(key=>{
                if(!Object.hasOwn(userProjectObj, key)){
                  userProjectObj[key] = []
                }
            })

            for(let key in userProjectObj){
                projectsPerUser.push(userProjectObj[key])
            }
            
            console.log(data.user, userProjectObj)

            barChart.data.datasets[1].data = projectsPerUser.map(ele=> ele.length)
            barChart.update()
 */

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
                data: [],
                backgroundColor: [
                    'rgba(255, 99, 132, .7)',
                    'rgba(54, 162, 235, .7)',
                    'rgba(255, 206, 86, .7)',
                    'rgba(75, 192, 192, .7)',
                    'rgba(153, 102, 255, .7)',
                    'rgba(255, 159, 64, .7)'
                ],
                borderColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 206, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(153, 102, 255)',
                    'rgb(255, 159, 64)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true
        }
    });

    const barChart = new Chart(line, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Tasks',
                data: [],
                backgroundColor: [
                    'rgba(255, 99, 132, .7)'
                ],
                borderColor: [
                    'rgb(255, 99, 132)'
                ],
                borderWidth: 1,
                //yAxisID: 'y'
            },
                //can add more datasets in the array, so I can plot multiple datasets in the same graph
            {
                label: 'Projects',
                data: [],
                backgroundColor: [
                    'rgba(54, 162, 235, .7)'
                ],
                borderColor: [
                    'rgb(54, 162, 235)'
                ],
                borderWidth: 1,
                /* yAxisID: 'y1' */
            },
            {
                label: 'Closed tasks',
                data: [],
                backgroundColor: [
                    'rgba(255, 206, 86, .7)'
                ],
                borderColor: [
                    'rgb(255, 206, 86)'
                ],
                borderWidth: 1,
                /* yAxisID: 'y1' */
            }
        ]
        },
        options: {
            responsive: true,
            //maintainAspectRatio: false,
            /* interaction: {
                mode: 'index',
            }, */
            // intersect: false,
            // stacked: false,
            scales: {
                y: {
                  //type: 'linear',
                  display: true,
                  //position: 'left',
                  //y axis begin at 0
                  beginAtZero: true,
                  /* ticks: {
                      //Achieved integers for Y axis
                      precision: 0
                  } */
                },
              /*   y1: {
                  type: 'linear',
                  display: true,
                  position: 'right',
                  beginAtZero: true,
                  ticks: {
                      precision: 0
                  },
                  // grid line settings
                  grid: {
                    drawOnChartArea: false, // only want the grid lines for one axis to show up
                  },
                }, */
            }
        }
    });
}