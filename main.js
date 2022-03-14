$(function() {
	let data;
	let lon, lat
	let cityName;
	let ctime

	function convertTZ(date, tzString) {
		console.log(date)
		return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", { timeZone: tzString }))
	}

	function updateHTML(data) {
		let { avgtemp_c, maxtemp_c, mintemp_c, avghumidity, uv, maxwind_kph, avgvis_km } = data.day
		let { sunset, sunrise } = data.astro
		let { icon, text } = data.day.condition
		//		icon=hdata.condition.icon

		//	$('#temp-icon').text(icon)
		$('#temp').text(Math.round(avgtemp_c) + '°C')
		$('#max-temp').text(Math.round(maxtemp_c) + '°C')
		$('#min-temp').text(Math.round(mintemp_c) + '°C')
		//	$('#time').text(time.toLocaleString())
		$('#temp-icon').html(`<img src="${icon}"/>`)
		$('#description').text(text)
		$('#humidity').text(avghumidity + '%')
		$('#uv').text(uv)
		$('#wind').text(maxwind_kph + 'km/h')
		$('#vis').text(avgvis_km + 'km')
		$('#sunrise').text(sunrise)
		$('#sunset').text(sunset)
		updateHourly(data.hour)
	}

	function updateHourly(data) {
			console.log(ctime.toString())

		data.forEach((hdata) => {
			let { chance_of_rain, time, temp_c } = hdata
			let htime = time.split(' ')[1]
			let dtime = time.split(' ')[0]
			let icon = hdata.condition.icon
			let html = `
			<div class="card p-0  my-3 w-auto border-0 bg-transparent  my-3  text-center ">
				<div class=" card-body p-2 border-start border-end ">
				<h1 class="card-title m-0">${htime}</h1>
				<img src="${icon}"> 
				<p class="card-text fs-3 m-0">${temp_c}</p>
				<p class="card-text fs-6">💧${chance_of_rain}%</p>
				</div>
			</div> 
			`
			if (ctime.getDate() < dtime.split('-')[2]) {
				$('#hourly').append(html)
			} else {
				if (ctime.getHours() <= htime.split(':')[0]) {
					$('#hourly').append(html)
				}
			}
		})
	}

	function updateDay(i) {
		updateHTML(data.forecast.forecastday[i])
	}

	function update(day) {
		let city = $('#search').val()
		fetch(`https://api.weatherapi.com/v1/forecast.json?key=ed8e5ff400244a488c2112551221203&q=${city}&days=4&aqi=no&alerts=no`)
			.then(res => res.json())
			.then(d => {
				cityName = d.location.name + ', ' + d.location.country
				$('#locat').text(cityName)
				data = d

				console.log(d)
				ctime = convertTZ(new Date(), d.location.tz_id)
				updateDay(day)
			})
	}
	update(0)

	$('#search-btn').click(() => {
		update(0)


	})

	$('#day1').click(() => {
		update(0)
		$('#hourly').html('')



	})
	$('#day2').click(() => {
		update(1)
		$('#hourly').html('')

	})
	$('#day3').click(() => {
		update(2)
		$('#hourly').html('')

	})
	$(' .card').addClass('border-0  bg-transparent my-3  text-center text-light')

});
