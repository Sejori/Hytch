import { getState, createState } from "/js/state.js"

function toggleSelectDate(event) {
  createState({
    _var: "selectedDates",
    value: event.target.value,
    listeners: []
  })
}

function shareDates() {
  let selectedDates = getState("selectedDates")
  try {
    var sharePromise = window.navigator.share(selectedDates)
  } catch {
    let dateLink = "date id: " + selectedDates
    navigator.clipboard.writeText(dateLink).then(function() {
      /* clipboard successfully set */
      alert("Link copied to clipboard!")
    }, function() {
      /* clipboard write failed */
      alert("Link copy failed. Copy link displayed above share button.")
      let linkText = document.createElement("p")
      linkText.textContent = dateLink
      document.querySelector("#date-share-div").appendChild(linkText)
    })
  }
}

function displayRegion(region) {
  var regionText = document.querySelector("#region-text")
  regionText.textContent = "Explore today's choices in " + region + " London."
  regionText.style.display = "flex"
}

function displayDates (dates) {
  dates.forEach(date => {

    // create list item for date and append to dates-list
    let dateLi = document.createElement("li")
    let dateTitle = document.createElement("h2")
    let dateDesc = document.createElement("p")
    let dateCheckbox = document.createElement("input")
    dateCheckbox.type = "checkbox"
    dateCheckbox.value = date._id
    dateCheckbox.addEventListener("click", toggleSelectDate)

    dateTitle.textContent = date.title
    dateDesc.textContent = date.description

    dateLi.appendChild(dateTitle)
    dateLi.appendChild(dateDesc)
    dateLi.appendChild(dateCheckbox)

    document.querySelector("#dates-list").append(dateLi)
  })
}

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
    displayRegion(region)
    return dates
  }

  let response = await fetch("https://hytch-cms.herokuapp.com/activities")
  let dates = await response.json()
  return dates
}

async function setupDates () {
  var dates = await getDates()
  displayDates(dates)
}

let shareButton = document.querySelector("#dates-share-button")
shareButton.addEventListener("click", shareDates)

export { setupDates }
