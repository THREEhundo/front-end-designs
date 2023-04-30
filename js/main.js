const track = document.querySelector('.image-track')

const handleOnDown = e => (track.dataset.mouseDownAt = e.clientX)

const handleOnUp = () => {
	track.dataset.mouseDownAt = '0'
	track.dataset.prevPercentage = track.dataset.percentage
}

const handleOnMove = e => {
	if (track.dataset.mouseDownAt === '0') return

	const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientX,
		maxDelta = window.innerWidth / 2

	const percentage = (mouseDelta / maxDelta) * -100,
		nextPercentageUnconstrained =
			parseFloat(track.dataset.prevPercentage) + percentage,
		nextPercentage = Math.max(
			Math.min(nextPercentageUnconstrained, 0),
			-100
		)

	track.dataset.percentage = nextPercentage

	track.animate(
		{
			transform: `translate(${nextPercentage}%, -50%)`
		},
		{ duration: 1200, fill: 'forwards' }
	)

	for (const image of track.getElementsByClassName('image')) {
		const container = image.parentElement
		container.animate(
			{
				transform: `translate(${nextPercentage}%, -50%)`
			},
			{ duration: 1200, fill: 'forwards' }
		)
		image.animate(
			{
				objectPosition: `${100 + nextPercentage}% center`
			},
			{ duration: 1200, fill: 'forwards' }
		)
	}
}

const handleOnWheel = e => {
	e.preventDefault()

	// calculate the amount of change in the scroll wheel delta
	const delta = e.deltaY
	// calculate the maximum amount that the track should be translated based on the width of the window
	const maxDelta = window.innerWidth / 2
	// get the previous percentage value from the data attribute of the track element and convert it to a float
	let prevPercentage = parseFloat(track.dataset.prevPercentage)
	// calculate the new percentage value based on the previous value and the amount of change in the scroll wheel delta
	let nextPercentage = prevPercentage - (delta / maxDelta) * 10

	// check if the new percentage value is greater than 0
	if (nextPercentage > 0) {
		// if so, set it to 0 (to prevent the images from scrolling too far to the right)
		nextPercentage = 0
	} else if (nextPercentage < -100) {
		// check if the new percentage value is less than -100
		// if so, set it to -100 (to prevent the images from scrolling too far to the left)
		nextPercentage = -100
	}

	// set the new percentage value in the data attribute of the track element
	track.dataset.percentage = nextPercentage

	// animate the track element to translate it to the new position
	track.animate(
		{
			transform: `translate(${nextPercentage}%, -50%)`
		},
		{ duration: 1200, fill: 'forwards' }
	)

	// loop through each image element inside the track element
	for (const image of track.getElementsByClassName('image')) {
		// get the container element that wraps the image
		const container = image.parentElement
		// animate the container element to translate it to the new position
		container.animate(
			{
				transform: `translate(${nextPercentage}%, -50%)`
			},
			{ duration: 1200, fill: 'forwards' }
		)
		// animate the image element to adjust its horizontal position within the container
		image.animate(
			{
				objectPosition: `${100 + nextPercentage}% center`
			},
			{ duration: 1200, fill: 'forwards' }
		)
	}

	// update prevPercentage to the new value of nextPercentage
	prevPercentage = nextPercentage
	track.dataset.prevPercentage = prevPercentage.toString()
}

/* -- Refactored code to add {passive: false} option to the wheel event listener -- */

window.addEventListener('wheel', handleOnWheel, { passive: false })

/* -- Had to add extra lines for touch events -- */

window.onmousedown = e => handleOnDown(e)

window.ontouchstart = e => handleOnDown(e.touches[0])

window.onmouseup = e => handleOnUp(e)

window.ontouchend = e => handleOnUp(e.touches[0])

window.onmousemove = e => handleOnMove(e)

window.ontouchmove = e => handleOnMove(e.touches[0])
