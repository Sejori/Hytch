import { createState, updateState, getState } from "/js/state.js"
import { setupDates } from "/js/dates.js"

// define the routes inside an object called routes and assign each route it's content div
// make sure 404 is final route
var routes = [
  {
    pathname: "/",
    div: document.getElementById("home"),
    setup: null
  },
  {
    pathname: "/dates",
    div: document.getElementById("dates"),
    setup: setupDates
  }
]

function getPathname() {
  let pathname = window.location.pathname
  // format if necessary
  if (pathname.includes('?')) pathname = pathname.substring(0, pathname.indexOf('?'))
  if (pathname.substring(1).includes('/')) {
    pathname = pathname.substring(1)
    pathname = pathname.substring(0, pathname.indexOf('/'))
    pathname = "/" + pathname
  }
  return pathname
}

function storeParams () {
  let params = (new URL(document.location)).searchParams

  params.forEach((value, key) => {

    if (getState(key)) {
      updateState({
        _var: key,
        value: value,
        listeners: []
      })
    } else {
      createState({
        _var: key,
        value: value,
        listeners: []
      })
    }
  })
}

// function to be called on every new navigation
function router() {
  // set all routed divs to display: none
  // note: all routed divs are set to display: none in css as well in case browser has js disabled
  for (var i = 0; i < routes.length; i++) {
    routes[i].div.style.display = "none;"
  }

  // get clean pathname
  let pathname = getPathname()

  // store parameters in state
  storeParams()

  // find corrent route object if available
  let route = routes.find(route => route.pathname === pathname)

  if (route) {
    // do routing functions
    route.div.style.display = "flex"

    if (route.setup) route.setup()
  } else {
    console.log('404: Route not found')
    // return 404 content
    routes[routes.length-1].div.style.display = "flex"
  }
}

// call router function on load
router()
