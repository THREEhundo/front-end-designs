const track = document.getElementById('image-track')

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

	const delta = e.deltaY
	const maxDelta = window.innerWidth / 6
	let prevPercentage = parseFloat(track.dataset.prevPercentage)
	let nextPercentage = prevPercentage - (delta / maxDelta) * 10

	if (nextPercentage > 0) {
		nextPercentage = 0
	} else if (nextPercentage < -100) {
		nextPercentage = -100
	}

	track.dataset.percentage = nextPercentage

	track.animate(
		{
			transform: `translate(${nextPercentage}%, -50%)`
		},
		{ duration: 1200, fill: 'forwards' }
	)

	for (const image of track.getElementsByClassName('image')) {
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
