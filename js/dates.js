import { getState } from "/js/state.js"

function getDates () {
  let region = getState("region")
  let dateIds = getState("ids")

  if (!region && dateIds) {
    let dates = dateIds.map(id async => {
      let date = await fetch(process.env.HYCTH_CMS_URI + "/activities?id=" + id)
      return date
    })
    return dates
  }

  if (region) return await fetch(process.env.HYCTH_CMS_URI + "/activities?region=" + region)

  return await fetch(process.env.HYCTH_CMS_URI + "/activities")
}

function displayDates (dates) {
  // create list items for each data and push to list in dates section
  console.log(dates)
}

var dates = getDates()
displayDates(dates)
