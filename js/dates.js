import { setState, getState } from "/js/state.js"

function toggleSelectDate(event) {
  setState("selectedDates", event.target.value)
}

function toggleHytchExpand(event) {
  let dateInfo = event.target.parentElement.parentElement.getElementsByClassName("hytch-dates-info")[0]
  if (dateInfo.style.display === "none") {
    dateInfo.style.display = "flex"
    return
  }
  dateInfo.style.display = "none"
  return
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

function displayDates (hytches) {
  hytches.forEach(hytch => {
    console.log(hytch)

    // create list item for date and append to dates-list
    let hytchLi = document.createElement("li")
    let checkboxDiv = document.createElement("div")
    let contentDiv = document.createElement("div")
    checkboxDiv.className = "hytch-checkbox-div"
    contentDiv.className = "hytch-content"

    let topContent = document.createElement("div")
    let topContentText = document.createElement("div")
    topContentText.className = "hytch-title-text"

    let hytchCheckbox = document.createElement("input")
    hytchCheckbox.type = "checkbox"
    hytchCheckbox.value = hytch._id
    hytchCheckbox.addEventListener("click", toggleSelectDate)

    let hytchExpandButton = document.createElement("img")
    hytchExpandButton.src = "/assets/expand.svg"
    hytchExpandButton.alt = "expand-button"
    hytchExpandButton.className = "hytch-expand-button"
    hytchExpandButton.addEventListener("click", toggleHytchExpand)

    let hytchTitle = document.createElement("h2")
    hytchTitle.textContent = "hytch.title"
    let hytchDesc = document.createElement("p")
    hytchDesc.className = "hytch-desc"
    hytchDesc.textContent = "hytch.description"

    let hytchDates = document.createElement("div")
    hytchDates.className = "hytch-dates"
    let hytchDatesInfo = document.createElement("div")
    hytchDatesInfo.style.display = "none"
    hytchDatesInfo.className = "hytch-dates-info"
    hytchDatesInfo.textContent = "date info will be here"

    let hytchDate1 = document.createElement("h3")
    let hytchDate2 = document.createElement("h3")
    hytchDate1.textContent = "emoji + hytch.date1.title"
    hytchDate2.textContent = "emoji + hytch.date2.title"

    topContentText.appendChild(hytchTitle)
    topContentText.appendChild(hytchDesc)

    topContent.appendChild(topContentText)
    topContent.appendChild(hytchExpandButton)

    hytchDates.appendChild(hytchDate1)
    hytchDates.appendChild(hytchDate2)

    checkboxDiv.appendChild(hytchCheckbox)
    contentDiv.appendChild(topContent)
    contentDiv.appendChild(hytchDates)
    contentDiv.appendChild(hytchDatesInfo)

    hytchLi.appendChild(checkboxDiv)
    hytchLi.appendChild(contentDiv)

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
