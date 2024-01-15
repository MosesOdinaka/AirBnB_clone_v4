$(document).ready(function () {
    const statusUrl = `http://${window.location.hostname}:5001/api/v1/status/`;
    $.get(statusUrl, function (response) {
        const apiStatus = $('#api_status');
        response.status === 'OK' ? apiStatus.addClass('available') : apiStatus.removeClass('available');
    });

    const searchUrl = `http://${window.location.hostname}:5001/api/v1/places_search/`;
    $.ajax({
        type: 'POST',
        url: searchUrl,
        data: JSON.stringify({}),
        success: function (data) {
            for (const place of Object.values(data)) {
                $('.places').append(`<article>
                    <div class="title">
                        <h2>${place.name}</h2>
                        <div class="price_by_night">${place.price_by_night}</div>
                    </div>
                    <div class="information">
                        <div class="max_guest">
                            <i class="fa fa-users fa-3x" aria-hidden="true"></i><br />
                            ${place.max_guest} Guests
                        </div>
                        <div class="number_rooms">
                            <i class="fa fa-bed fa-3x" aria-hidden="true"></i><br />
                            ${place.number_rooms} Bedrooms
                        </div>
                        <div class="number_bathrooms">
                            <i class="fa fa-bath fa-3x" aria-hidden="true"></i><br />
                            ${place.number_bathrooms} Bathroom
                        </div>
                    </div>
                    <div class="description">${place.description}</div>
                </article>`);
            }
        },
        error: function () {
            console.log('Data is not in JSON format');
        },
        dataType: 'json',
        contentType: 'application/json'
    });

    const amenitiesDict = {};
    $('INPUT[type="checkbox"]').change(function () {
        const amenityId = $(this).attr('data-id');
        if ($(this).is(':checked')) {
            amenitiesDict[amenityId] = $(this).attr('data-name');
        } else {
            delete amenitiesDict[amenityId];
        }
        $('.amenities H4').text(Object.values(amenitiesDict).join(', '));
    });
});
