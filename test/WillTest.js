const siph = require('./../lib/Siphon');


var mySiphon = siph()
// .get('https://www.wunderground.com/cgi-bin/findweather/getForecast?query=90025')
.find(/[0-9]{2}\.[0-9]/)
.store( (datum) => {
  console.log(datum[0]);
})



.execute();

