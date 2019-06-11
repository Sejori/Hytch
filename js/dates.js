import { setState, getState } from "/js/state.js"
import { hytchBuilder } from "/js/hytchDisplay.js"

let hytchUrl = window.location.origin

function shareDates() {
  if (getState("pathname") === "/hytches") {
    let selectedDate = getState("selectedDate")

    if (!selectedDate) {
      alert("Select a date to confirm!")
      return
    }

    let dateLink = hytchUrl + "/hytch?ids=" + selectedDate
    let shareObj = {
      title: document.title,
      text: "Date confirmed! 🎉 Click to see what I chose.",
      url: dateLink
    }

    if (navigator.share !== undefined) {
      navigator.share(shareObj)
        .catch(err => console.log(err))
    }

    if (navigator.clipboard.writeText !== undefined) {
      navigator.clipboard.writeText(dateLink).then(function() {
        alert("Link copied to clipboard!")
      })
    }

    let linkText = document.createElement("p")
    linkText.textContent = dateLink
    document.querySelector("#date-share-div").appendChild(linkText)
  }

  if (getState("pathname") !== "/hytches") {
    let selectedDates = getState("selectedDates")
    if (!selectedDates || selectedDates.length < 2) {
      alert("Pick at least 2 Hytches to share with your partner!")
      return
    }

    let dateLink = hytchUrl + "/hytches?ids=" + selectedDates
    let shareObj = {
      title: document.title,
      text: "I've shortlisted some great date ideas on Hytch. Click the link to see what I chose.",
      url: dateLink
    }

    if (navigator.share !== undefined) {
      navigator.share(shareObj)
        .catch(err => console.log(err))
      return
    }

    if (navigator.clipboard.writeText !== undefined) {
      navigator.clipboard.writeText(dateLink).then(function() {
        alert("Link copied to clipboard!")
      })
      return
    }

    let linkText = document.createElement("p")
    linkText.textContent = dateLink
    document.querySelector("#date-share-div").appendChild(linkText)
    return
  }

  window.location.assign(hytchUrl + "/hytch?ids=" + getState("selectedDates"))
  return
}

function displayCongrats() {
  document.querySelector("#congrats-div").style.display = "flex"
  Array.from(document.getElementsByClassName("hytch-share-button")).forEach( button => {
    button.textContent = "SHARE HYTCH"
  })
  confetti.maxCount = 100
  confetti.gradient = false
  confetti.start()
  setTimeout(function(){
    confetti.stop()
  }, 2000)
}

function displayConfirm() {
  document.querySelector("#choose-div").style.display = "flex"
  Array.from(document.getElementsByClassName("hytch-share-button")).forEach( button => {
    button.textContent = "CHOOSE OUR HYTCH"
  })
}

function displayRegion(region) {
  let regionEmojis = [
    [ "north", "🎧" ],
    [ "east", "💃" ],
    [ "south", "🌳" ],
    [ "west", "👠" ],
    [ "central", "🎡" ]
  ]

  let regionDiv = document.querySelector("#region-div")
  let regionEmoji = document.querySelector("#region-emoji")
  let regionText = document.querySelector("#region-text")

  regionText.textContent = region.charAt(0).toUpperCase() + region.slice(1) + " London."
  regionEmoji.textContent = regionEmojis.filter(regionEmoji => regionEmoji[0] === region)[0][1]
  regionDiv.style.display = "flex"
}

function displayDates (hytches) {
  let hytchList = document.querySelector("#hytches-list")
  if (!hytches) {
    hytchList.textContent = "Please go back and select a region"
    document.querySelector("#hytch-share-button").style.display = "none"
    Array.from(document.querySelector("#hytch-share-button")).forEach( button => {
      button.style.display = "none"
    })
    return
  }
  hytches.forEach(hytch => {
    let hytchLi = hytchBuilder(hytch)
    hytchList.append(hytchLi)

    // sponsored hytch handling
    for (let i=0; i<hytchLi.childNodes.length; i++) {
      if (hytchLi.sponsored) {
        hytchList.insertBefore(hytchLi, hytchList.childNodes[0])
      }
    }

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
  return
}

async function setupDates () {
  let dates = await getDates()
  await displayDates(dates)
  if (getState("pathname") === "/hytch") {
    setState("selectedDate", dates[0].id)
    document.querySelector(".hytch-checkbox-div").style.display = "none"
    Array.from(document.getElementsByClassName("hytch-expand-button")).forEach(button => {
      button.click()
    })
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

Array.from(document.getElementsByClassName("hytch-share-button")).forEach(button => {
  button.addEventListener("click", shareDates)
})

export { setupDates }
