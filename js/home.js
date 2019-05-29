function goToRegion() {
  let regionSelector = document.querySelector("#region-selector")
  let region = regionSelector.value
  document.location.assign('/' + region)
}

document.querySelector("#region-submit").addEventListener("click", goToRegion)
