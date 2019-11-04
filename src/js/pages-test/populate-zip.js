import findALab from "../findalab";

// Function used to retrieve cookies.
const getCookie = (cname) => {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

findALab('#simple-findalab').load('/template/findalab.html', function() {
  window.labfinder = findALab(this).find('.findalab').findalab({
    baseURL: 'http://findalab.local/fixtures/simple-mockups',
    googleMaps: {
      mapMarkerFillColor: '#0000ee'
    },
    lab: {
      buttonText: 'Choose this place, yo!'
    },
    search: {
      buttonText: 'Find Simple',
      placeholder: 'Fill in the zippaty codes'
    }
  });

  const postalCode = getCookie('postalCode');

  if (postalCode) {
    window.labfinder.search(postalCode);
  }
});
