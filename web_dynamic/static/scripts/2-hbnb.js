$(document).ready(function () {
	// Define the URL for the API status check
	const apiStatusUrl = 'http://' + window.location.hostname + ':5001/api/v1/status/';
	
	// Perform a GET request to the API status URL
	$.get(apiStatusUrl, function (response) {
		// Check the status of the response
		if (response.status === 'OK') {
			$('#api_status').addClass('available');
		} else {
			$('#api_status').removeClass('available');
		}
	});

	// Define an object to store the amenities
	const selectedAmenities = {};
	
	// Add a change event listener to the checkbox inputs
	$('INPUT[type="checkbox"]').change(function () {
		// Check if the checkbox is checked
		if ($(this).is(':checked')) {
			// Add the amenity to the selected amenities
			selectedAmenities[$(this).attr('data-id')] = $(this).attr('data-name');
		} else {
			// Remove the amenity from the selected amenities
			delete selectedAmenities[$(this).attr('data-id')];
		}
		// Update the text of the amenities header
		$('.amenities H4').text(Object.values(selectedAmenities).join(', '));
	});
});
