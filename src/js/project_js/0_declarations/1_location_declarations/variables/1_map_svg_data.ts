// The real stuff. This is where the svg image for the actual location is stored.
// Create the relevant map areas on the image using drawing tools and give them ids corresponding with the named values in `MapLocation`. Export the svg (preferably compressed) and add it here. Note to fix the image directory and try to clean up any unnecessary values. Also, give the svgs a fill colour else they won't get rendered (from my testing)
const gLocationMapSvgTable: { [key in MapLocation]?: SvgString } = {
  [MapLocation.FERTILO_INC_GROUND_FLOOR]: `
  <svg id="svg1" version="1.1" viewBox="0 0 66.667 48" xmlns="http://www.w3.org/2000/svg">
    <image id="image1" width="66.667" height="48" fill="none" image-rendering="crisp-edges" href="assets/img/map/location/fertilo_inc_ground_floor.webp" preserveAspectRatio="none"/>
    <g id="g1">
      <path id="RECEPTION" d="m29.274 37.071-0.0027 0.23458-0.23592-0.0027 0.0027 0.2427-0.23861-0.0027-0.0036 8.1202 0.23771-0.0018 0.0027 0.23639 0.23053 0.0027 0.0045 0.0027 0.0017 0.23549 7.5888 4.69e-4 0.0036-0.24812 0.23053 0.0081 0.0017-0.25353 0.23322 0.01181v-8.1022l-0.24399-0.0027 0.0027-0.24h-0.23322v-0.23729z" fill-opacity=".24819"/>
      <text id="text1" transform="rotate(-43.202)" x="-9.6072531" y="53.800423" fill="#000000" fill-opacity=".6537" font-size="2.271px" stroke-width="0" xml:space="preserve"><tspan id="tspan1" x="-9.6072531" y="53.800423" fill="#000000" fill-opacity=".6537" stroke-width="0">Reception</tspan></text>
    </g>
    <g id="g3">
      <path id="MEASUREMENT_CLOSET" d="m38.392 37.071-0.0067 0.19816 0.20335 0.01024 0.0067 0.0066h0.01375l-0.0067 0.20147 0.20668 0.01024 0.02067 0.0066-0.0034 4.3596 4.6254 0.0033-4.42e-4 -4.7972z" fill-opacity=".24819"/>
      <text id="text2" transform="rotate(-43.099)" x="0.3546485" y="57.453499" fill="#000000" fill-opacity=".6537" font-family="sans-serif" font-size="1.6983px" stroke-width="0" style="font-variant-caps:normal;font-variant-east-asian:normal;font-variant-ligatures:normal;font-variant-numeric:normal" xml:space="preserve"><tspan id="tspan2" x="0.3546485" y="57.453499" stroke-width="0">Closet</tspan></text>
    </g>
    <g id="g4">
      <path id="PHARMACY_1" d="m21.068 37.07 0.0064 4.8177 5.9645-0.01373 0.01455-4.385 0.21256 0.0097-0.0095-0.22383h0.2077l0.0049-0.1997z" fill-opacity=".24819"/>
      <text id="text3" transform="rotate(-32.855)" x="-3.9887943" y="46.957668" fill="#000000" fill-opacity=".6537" font-family="sans-serif" font-size="1.9088px" stroke-width="0" style="font-variant-caps:normal;font-variant-east-asian:normal;font-variant-ligatures:normal;font-variant-numeric:normal" xml:space="preserve"><tspan id="tspan3" x="-3.9887943" y="46.957668" stroke-width="0">Pharm</tspan></text>
    </g>
    <path id="CORRIDOR_1" d="m31.196 28.008 0.02972 7.9874h3.7087v-7.9874z" fill-opacity=".24819"/>
    <g id="g6">
      <path id="LAB" d="m21.345 28.301 0.0017 6.1002 7.458 8.56e-4 0.0026-6.1088z" fill-opacity=".24819"/>
      <text id="text5" transform="rotate(-34.129)" x="0.38754654" y="41.102806" fill="#000000" fill-opacity=".6537" font-family="sans-serif" font-size="3.2016px" stroke-width="0" style="font-variant-caps:normal;font-variant-east-asian:normal;font-variant-ligatures:normal;font-variant-numeric:normal" xml:space="preserve"><tspan id="tspan5" x="0.38754654" y="41.102806" stroke-width="0">Lab</tspan></text>
    </g>
    <g id="g5" transform="matrix(.98965 0 0 .874 .64329 3.1306)">
      <g fill-opacity=".24819">
      <path id="HALLWAY_7" d="m54.605 19.3 0.01708 7.92 7.5057 0.0135-0.0038-7.92z"/>
      <path id="HALLWAY_6" d="m45.974 19.3 0.01833 7.92 8.0544 0.0135-0.0041-7.92z"/>
      <path id="HALLWAY_5" d="m37.343 19.3 0.01839 7.92 8.0833 0.0135-0.0041-7.92z" stroke-width="0"/>
      </g>
      <g id="g10">
      <path id="HALLWAY_4" d="m28.716 19.3 0.01838 7.92 8.0746 0.0135-0.0041-7.92z" fill-opacity=".24819"/>
      <text id="text4" transform="scale(.91627 1.0914)" x="28.137169" y="22.409613" fill="#000000" fill-opacity=".6537" font-family="sans-serif" font-size="4.2352px" stroke-width="0" style="font-variant-caps:normal;font-variant-east-asian:normal;font-variant-ligatures:normal;font-variant-numeric:normal" xml:space="preserve"><tspan id="tspan4" x="28.137169" y="22.409613" stroke-width="0">Hallway</tspan></text>
      </g>
      <g fill-opacity=".24819">
      <path id="HALLWAY_3" d="m20.113 19.3 0.01837 7.92 8.0734 0.0135-4e-3 -7.92z"/>
      <path id="HALLWAY_2" d="m11.47 19.3 0.01832 7.92 8.0529 0.0135-0.0041-7.92z"/>
      <path id="HALLWAY_1" d="m3.44 19.3 0.017025 7.92 7.4812 0.0135-0.0038-7.92z"/>
      </g>
    </g>
    <g id="g8">
      <path id="OFFICE_WORK" d="m55.444 18.656v-0.02845l-7e-3 -6.102 6.4368 0.0069 0.01439 6.0935z" fill-opacity=".24819"/>
      <text id="text7" transform="rotate(-38.162)" x="33.911911" y="49.124802" fill="#000000" fill-opacity=".6537" font-family="sans-serif" font-size="1.8846px" stroke-width="0" style="font-variant-caps:normal;font-variant-east-asian:normal;font-variant-ligatures:normal;font-variant-numeric:normal" xml:space="preserve"><tspan id="tspan7" x="33.911911" y="49.124802" stroke-width="0">Office</tspan></text>
    </g>
    <g id="g7">
      <path id="PHARMACY_2" d="m38.902 28.273 0.01396 5.0874 5.3386-0.0067-0.0025-5.0456z" fill-opacity=".24819"/>
      <text id="text6" transform="rotate(-44.118)" x="5.5276318" y="51.621925" fill="#000000" fill-opacity=".6537" font-family="sans-serif" font-size="1.8716px" stroke-width="0" style="font-variant-caps:normal;font-variant-east-asian:normal;font-variant-ligatures:normal;font-variant-numeric:normal" xml:space="preserve"><tspan id="tspan6" x="5.5276318" y="51.621925" stroke-width="0">Pharm</tspan></text>
    </g>
    <g id="g9">
      <path id="CONSULTATION_ROOM" d="m44.521 18.66 0.02002-5.0657-5.8875-0.01966 0.02002 5.1077z" fill-opacity=".24819"/>
      <text id="text8" transform="rotate(-34.627)" x="21.956957" y="37.248199" fill="#000000" fill-opacity=".6537" font-family="sans-serif" font-size="1.0577px" stroke-width="0" style="font-variant-caps:normal;font-variant-east-asian:normal;font-variant-ligatures:normal;font-variant-numeric:normal" xml:space="preserve"><tspan id="tspan8" x="21.956957" y="37.248199" stroke-width="0">Consultation</tspan></text>
    </g>
  </svg>
  `,
};
