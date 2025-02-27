/* eslint-disable */

export const displayMap = locations => {
  mapboxgl.accessToken = 'pk.eyJ1IjoiYWRkeTA5OCIsImEiOiJja2p5Y3VpY2gxMHlhMnVsczJ2bXptbzd1In0.xI9u_ruXAsnTMDKltOtF1A';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/addy098/ckjykbmz121mq17pchs81539h',
  scrollZoom: false
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach(loc => {
  // Create marker
  const el = document.createElement('div');
  el.className = 'marker';

  // Add the marker
  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom'
  }).setLngLat(loc.coordinates).addTo(map);


  // Add popup
  new mapboxgl.Popup({
    offset: 30,
  }).setLngLat(loc.coordinates).setHtml(`<p>Day ${loc.day}: ${loc.description}<p>`)
  .addTo(map);

  // extend map bounds to include current location
  bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 150,
    left: 100,
    right: 100,
  }
});
}

