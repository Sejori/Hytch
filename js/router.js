import { setState, getState } from "/js/state.js"
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
    pathname: "/hytch",
    div: document.getElementById("dates"),
    setup: setupDates
  },
  {
    pathname: "/hytches",
    div: document.getElementById("dates"),
    setup: setupDates
  },
  {
    pathname: "/north",
    div: document.getElementById("dates"),
    setup: setupDates
  },
  {
    pathname: "/east",
    div: document.getElementById("dates"),
    setup: setupDates
  },
  {
    pathname: "/south",
    div: document.getElementById("dates"),
    setup: setupDates
  },
  {
    pathname: "/west",
    div: document.getElementById("dates"),
    setup: setupDates
  },
  {
    pathname: "/central",
    div: document.getElementById("dates"),
    setup: setupDates
  },
  {
    pathname: "/404",
    div: document.getElementById("404"),
    setup: null
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

  // store pathname in module scope
  setState("pathname", pathname)

  return pathname
}

function storeParams () {
  let params = (new URL(document.location)).searchParams
  params.forEach((value, key) => {
    setState(key, value)
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
