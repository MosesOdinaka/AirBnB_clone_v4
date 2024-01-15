$(document).ready(function () {
    const apiStatusUrl = `http://${window.location.hostname}:5001/api/v1/status/`;
    $.get(apiStatusUrl, function (response) {
        const apiStatusElement = $('#api_status');
        response.status === 'OK' ? apiStatusElement.addClass('available') : apiStatusElement.removeClass('available');
    });

    const placesSearchUrl = `http://${window.location.hostname}:5001/api/v1/places_search/`;
    $.ajax({
        type: 'POST',
        url: placesSearchUrl,
        data: '{}',
        dataType: 'json',
        contentType: 'application/json',
        success: populatePlaces
    });

    const selectedAmenities = {};
    $('.amenities INPUT[type="checkbox"]').change(function () {
        const amenityId = $(this).attr('data-id');
        if ($(this).is(':checked')) {
            selectedAmenities[amenityId] = $(this).attr('data-name');
        } else {
            delete selectedAmenities[amenityId];
        }
        $('.amenities H4').text(Object.values(selectedAmenities).join(', '));
    });

    const selectedStates = {};
    $('.locations > UL > H2 > INPUT[type="checkbox"]').change(updateLocations);

    const selectedCities = {};
    $('.locations > UL > UL > LI > INPUT[type="checkbox"]').change(updateLocations);

    function updateLocations() {
        const locations = Object.assign({}, selectedStates, selectedCities);
        if (Object.values(locations).length === 0) {
            $('.locations H4').html(' ');
        } else {
            $('.locations H4').text(Object.values(locations).join(', '));
        }
    }

    $('button').click(function () {
        $.ajax({
            url: placesSearchUrl,
            type: 'POST',
            data: JSON.stringify({
                amenities: Object.keys(selectedAmenities),
                states: Object.keys(selectedStates),
                cities: Object.keys(selectedCities)
            }),
            contentType: 'application/json',
            dataType: 'json',
            success: populatePlaces
        });
    });
});

function populatePlaces(data) {
    const placesSection = $('section.places');
    placesSection.empty();
    placesSection.append(data.map(place => {
        return `<article>
            <div class="title">
                <h2>${place.name}</h2>
                <div class="price_by_night">${place.price_by_night}</div>
            </div>
            <div class="information">
                <div class="max_guest">
                    <i class="fa fa-users fa-3x" aria-hidden="true"></i></br>
                    ${place.max_guest} Guests
                </div>
                <div class="number_rooms">
                    <i class="fa fa-bed fa-3x" aria-hidden="true"></i></br>
                    ${place.number_rooms} Bedrooms
                </div>
                <div class="number_bathrooms">
                    <i class="fa fa-bath fa-3x" aria-hidden="true"></i></br>
                    ${place.number_bathrooms} Bathrooms
                </div>
            </div>
            <div class="description">${place.description}</div>
        </article>`;
    }));
}
