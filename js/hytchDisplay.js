import { getState, setState } from "/js/state.js"

function toggleSelectDate(event) {
  setState("selectedDates", event.target.value)
}

function toggleHytchExpand(event) {
  let dateInfo = event.target.parentElement.parentElement.getElementsByClassName("dates-div")[0]
  if (dateInfo.style.display === "none") {
    dateInfo.style.display = "flex"
    return
  }
  dateInfo.style.display = "none"
  return
}

function dateBuilder(date) {
  console.log(date)

  let dateEmojiDiv = document.createElement("div")
  let dateEmoji = document.createElement("p")
  dateEmoji.textContent = date.emoji
  dateEmojiDiv.className = "date-emoji"
  dateEmojiDiv.appendChild(dateEmoji)

  let dateImg = document.createElement("img")
  dateImg.src = "https://hytch-cms.herokuapp.com" + date.image[0].url
  dateImg.alt = date.image[0].name

  let dateMinPrice = document.createElement("p")
  dateMinPrice.textContent = "from £" + date.lowest_price
  dateMinPrice.className = "date-min-price"

  let dateTitle = document.createElement("h3")
  dateTitle.textContent = date.title

  let dateLink = document.createElement("a")
  dateLink.href = date.link
  dateLink.textContent = date.link

  let dateDescription = document.createElement("p")
  dateDescription.textContent = date.description

  let dateAddress = document.createElement("p")
  dateAddress.className = "date-address"
  dateAddress.textContent = date.address

  let dateDiv = document.createElement("div")
  dateDiv.className = "date-div"

  dateDiv.appendChild(dateEmojiDiv)
  dateDiv.appendChild(dateImg)
  dateDiv.appendChild(dateMinPrice)
  dateDiv.appendChild(dateTitle)
  dateDiv.appendChild(dateLink)
  dateDiv.appendChild(dateDescription)
  dateDiv.appendChild(dateAddress)

  return dateDiv
}

function travelBuilder(emoji, time, type) {
  let travelDiv = document.createElement("div")
  travelDiv.className = "travel-div"

  let travelEmoji = document.createElement("p")
  travelEmoji.textContent = "↓" + emoji
  travelEmoji.className = "travel-emoji"

  let travelText = document.createElement("p")
  travelText.textContent = time + " mins by " + type
  travelText.className = "travel-text"

  travelDiv.appendChild(travelEmoji)
  travelDiv.appendChild(travelText)

  return travelDiv
}

function hytchBuilder(hytch) {
  console.log(hytch)

  // build dates
  let date1Div = dateBuilder(hytch.activities[0])
  let date2Div = dateBuilder(hytch.activities[1])
  let travelDiv = travelBuilder(hytch.travel_emoji, hytch.travel_time, hytch.travel_type)

  let datesDiv = document.createElement("div")
  datesDiv.appendChild(date1Div)
  datesDiv.appendChild(travelDiv)
  datesDiv.appendChild(date2Div)
  datesDiv.style.display = "none"
  datesDiv.className = "dates-div"

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

  let hytchTitle = document.createElement("h3")
  hytchTitle.textContent = hytch.title
  let hytchDesc = document.createElement("p")
  hytchDesc.className = "hytch-desc"
  hytchDesc.textContent = hytch.description

  let hytchDates = document.createElement("div")
  hytchDates.className = "hytch-dates"

  let hytchDate1 = document.createElement("span")
  let hytchDate2 = document.createElement("span")
  hytchDate1.textContent = hytch.activities[0].emoji + " " + "Start at " + hytch.activities[0].title
  hytchDate2.textContent = hytch.activities[1].emoji + " " + "End at " + hytch.activities[1].title

  topContentText.appendChild(hytchTitle)
  topContentText.appendChild(hytchDesc)

  topContent.appendChild(topContentText)
  topContent.appendChild(hytchExpandButton)

  hytchDates.appendChild(hytchDate1)
  hytchDates.appendChild(hytchDate2)

  checkboxDiv.appendChild(hytchCheckbox)
  contentDiv.appendChild(topContent)
  contentDiv.appendChild(hytchDates)
  contentDiv.appendChild(datesDiv)

  hytchLi.appendChild(checkboxDiv)
  hytchLi.appendChild(contentDiv)

  return hytchLi
}

export { hytchBuilder }
