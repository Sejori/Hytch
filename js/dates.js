import { getState } from "/js/state.js"

async function getDates () {
  let region = getState("area_id")
  let dateIds = getState("date_id")

  if (!region && dateIds) {
    dateIds = dateIds.split(',')
    let dates = []
    for (let i=0; i<dateIds.length; i++) {
      let response = await fetch("https://hytch-cms.herokuapp.com/activities?id=" + dateIds[i])
      let date = await response.json()
      dates.push(date[0])
    }
    return dates
  }

  if (region) {
    let response = await fetch("https://hytch-cms.herokuapp.com/activities?area_id=" + region)
    let dates = await response.json()
    return dates
  }

  let response = await fetch("https://hytch-cms.herokuapp.com/activities")
  let dates = await response.json()
  return dates
}

function displayDates (dates) {
  dates.forEach(date => {
    console.log(date)

    // create list item for date and append to dates-list
    let dateLi = document.createElement("li")
    let dateTitle = document.createElement("h2")
    let dateDesc = document.createElement("p")

    dateTitle.textContent = date.title
    dateDesc.textContent = date.description

    dateLi.appendChild(dateTitle)
    dateLi.appendChild(dateDesc)

    document.querySelector("#dates-list").append(dateLi)
  })
}

async function setupDates () {
  var dates = await getDates()
  displayDates(dates)
}

export { setupDates }
