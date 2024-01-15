$(document).ready(function () {
    const statusApiUrl = `http://${window.location.hostname}:5001/api/v1/status/`;
    $.get(statusApiUrl, function (response) {
        const apiStatusIndicator = $('#api_status');
        response.status === 'OK' ? apiStatusIndicator.addClass('available') : apiStatusIndicator.removeClass('available');
    });

    const searchApiUrl = `http://${window.location.hostname}:5001/api/v1/places_search/`;
    $.ajax({
        type: 'POST',
        url: searchApiUrl,
        data: '{}',
        dataType: 'json',
        contentType: 'application/json',
        success: populatePlaces
    });

    const selectedAmenities = {};
    $('INPUT[type="checkbox"]').change(function () {
        const amenityId = $(this).attr('data-id');
        if ($(this).is(':checked')) {
            selectedAmenities[amenityId] = $(this).attr('data-name');
        } else {
            delete selectedAmenities[amenityId];
        }
        $('.amenities H4').text(Object.values(selectedAmenities).join(', '));
    });

    $('button').click(function () {
        $.ajax({
            url: searchApiUrl,
            type: 'POST',
            data: JSON.stringify({ amenities: Object.keys(selectedAmenities) }),
            contentType: 'application/json',
            dataType: 'json',
            success: populatePlaces
        });
    });
});

function populatePlaces (data) {
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
