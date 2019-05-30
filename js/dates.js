import { setState, getState } from "/js/state.js"
import { hytchBuilder } from "/js/hytchDisplay.js"

function shareDates() {
  let selectedDates = getState("selectedDates")
  try {
    var sharePromise = window.navigator.share(selectedDates)
  } catch {
    let dateLink = "https://hytch.netlify.com/hytches?ids=" + selectedDates
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

function displayDates (hytches) {
  hytches.forEach(hytch => {
    let hytchLi = hytchBuilder(hytch)
    document.querySelector("#hytches-list").append(hytchLi)
  })
}

async function getDates () {
  let region = getState("pathname").substring(1)
  let dateIds = getState("ids")

  let regions = getState("regions")
  let regionInt = regions.indexOf(region) + 1

  if (!regionInt && dateIds) {
    dateIds = dateIds.split(',')
    let dates = []
    for (let i=0; i<dateIds.length; i++) {
      let response = await fetch("https://hytch-cms.herokuapp.com/hytches?id=" + dateIds[i])
      let date = await response.json()
      dates.push(date[0])
    }
    return dates
  }

  if (regionInt) {
    let response = await fetch("https://hytch-cms.herokuapp.com/hytches?area_id=" + regionInt)
    let dates = await response.json()
    displayRegion(region)
    return dates
  }

  let response = await fetch("https://hytch-cms.herokuapp.com/hytches")
  let dates = await response.json()
  return dates
}

async function setupDates () {
  var dates = await getDates()
  displayDates(dates)
}

let regions = [
  "north",
  "east",
  "south",
  "west",
  "central"
]

setState("regions", regions)

let shareButton = document.querySelector("#hytch-share-button")
shareButton.addEventListener("click", shareDates)

export { setupDates }
