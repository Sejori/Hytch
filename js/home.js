function setupNavLinks() {
  document.querySelector("#home-button").href = window.location.origin
  document.querySelector("#about-button").href = window.location.origin + "/about"
  return
}

function goToRegion() {
  let regionSelector = document.querySelector("#region-selector")
  let region = regionSelector.value
  document.location.assign('/' + region)
}

setupNavLinks()
Array.from(document.getElementsByClassName("region-submit")).forEach(button => button.addEventListener("click", goToRegion))
