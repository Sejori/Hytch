function goToRegion() {
  let regionSelector = document.querySelector("#region-selector")
  let region = regionSelector.value
  document.location.assign('/' + region)
}

Array.from(document.getElementsByClassName("region-submit")).forEach(button => button.addEventListener("click", goToRegion))
