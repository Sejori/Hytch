import { setState, getState } from "/js/state.js"
import { hytchBuilder } from "/js/hytchDisplay.js"

function shareDates() {
  if (getState("pathname") === "/hytch") {
    let selectedDate = getState("selectedDate")
    let dateLink = "https://hytch-99f8e2.netlify.live/hytch?ids=" + selectedDate
    try {
      var sharePromise = window.navigator.share("I choose '" + + "' 🎉 Here it is:" + dateLink)
    } catch {
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
    return
  }

  if (getState("pathname") !== "/hytches") {
    let selectedDates = getState("selectedDates")
    let dateLink = "https://hytch-99f8e2.netlify.live/hytches?ids=" + selectedDates
    try {
      var sharePromise = window.navigator.share("I've shortlisted some great date ideas on Hytch. Click the link to choose which one you want to go on: " + dateLink)
    } catch {
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
    return
  }

  let selectedDates = getState("selectedDates")
  window.location.assign("https://hytch-99f8e2.netlify.live/hytch?ids=" + selectedDates)
  return
}

function displayCongrats() {
  document.querySelector("#congrats-div").style.display = "flex"
}

function displayConfirm() {
  let shareButton = document.querySelector("#hytch-share-button")
  shareButton.textContent = "SEND CHOICE BACK"
}

function displayRegion(region) {
  let regionDiv = document.querySelector("#region-div")
  let regionText = document.querySelector("#region-text")
  regionText.textContent = "Explore today's choices in " + region + " London."
  regionDiv.style.display = "flex"
}

function displayDates (hytches) {
  hytches.forEach(hytch => {
    let hytchLi = hytchBuilder(hytch)
    document.querySelector("#hytches-list").append(hytchLi)
  })
}

async function getDates () {
  let pathname = getState("pathname")
  let region = pathname.substring(1)
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
    if (pathname !== "/hytch") displayConfirm()
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
  let dates = await getDates()
  displayDates(dates)
  if (getState("pathname") === "/hytch") {
    setState("selectedDate", dates[0].id)
    document.querySelector(".hytch-checkbox-div").style.display = "none"
    displayCongrats()
  }
  return
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
