/*
 * Main set common settings of the application
 */

var BASE_URL = 'http://localhost:1337';

/* All message will be declared here */
var CONST = {
  MSGTIMEOUT: 4000,
}

$(document).ready(function () {
  /* Hide server side header messages */
  setTimeout(function () {
    //  $(".server-message").fadeOut(1600);
  }, CONST.MSGTIMEOUT);

})
/*
 *  For manage all actions for the admin
 */

$(document).ready(function () {
  // /*DataTable call if user list*/
  // if ($('#user-table').length > 0) {
  //   table = $('#user-table').DataTable({
  //     processing: true,
  //     serverSide: true,
  //     order: [],
  //     ajax: BASE_URL + '/user-data',
  //     columns: [
  //       {data: 'name', name: 'name'},
  //       {data: 'email', name: 'email'},
  //       {data: 'contact_no', name: 'contact_no', className: 'td-numerical'},
  //       {data: 'password', name: 'password'},
  //       {data: 'location', name: 'location'},
  //       {data: 'city', name: 'city'},
  //       {data: 'is_active', name: 'is_active', className: 'td-status', searchable: false, orderable: false},
  //       {data: 'action', name: 'action', className: 'td-action', searchable: false, orderable: false},
  //     ]
  //   });
  // }
  //
  // /*DataTable call if user supplier*/
  // if ($('#supplier-table').length > 0) {
  //   table = $('#supplier-table').DataTable({
  //     processing: true,
  //     serverSide: true,
  //     order: [],
  //     ajax: BASE_URL + '/supplier-data',
  //     columns: [
  //       {data: 'name', name: 'name'},
  //       {data: 'email', name: 'email'},
  //       {data: 'contact_no', name: 'contact_no', className: 'td-numerical'},
  //       {data: 'location', name: 'location'},
  //       {data: 'city', name: 'city'},
  //       {data: 'is_active', name: 'is_active', className: 'td-status', searchable: false, orderable: false},
  //       {data: 'action', name: 'action', className: 'td-action', searchable: false, orderable: false},
  //     ]
  //   });
  // }
  //
  // /*DataTable call if device list*/
  // if ($('#device-table').length > 0) {
  //   table = $('#device-table').DataTable({
  //     processing: true,
  //     serverSide: true,
  //     order: [],
  //     ajax: BASE_URL + '/device-data',
  //     columns: [
  //       {data: 'device_id', name: 'device_id'},
  //       {data: 'name', name: 'name'},
  //       {data: 'user_name', name: 'user_name'},
  //       {data: 'tank_name', name: 'tank_name'},
  //       {data: 'location', name: 'location'},
  //       {data: 'inactive_time', name: 'inactive_time'},
  //       {data: 'is_active', name: 'is_active', className: 'td-status', searchable: false, orderable: false},
  //       {data: 'action', name: 'action', className: 'td-action', searchable: false, orderable: false},
  //     ]
  //   });
  // }
  //
  // /*DataTable call if city list*/
  // if ($('#city-table').length > 0) {
  //   table = $('#city-table').DataTable({
  //     processing: true,
  //     serverSide: true,
  //     order: [],
  //     ajax: BASE_URL + '/city/cityData',
  //     columns: [
  //       {data: 'location', name: 'location'},
  //       {data: 'city', name: 'city'},
  //       {data: 'country', name: 'country'},
  //       {data: 'is_active', name: 'is_active', className: 'td-status', searchable: false, orderable: false},
  //       {data: 'action', name: 'action', className: 'td-action', searchable: false, orderable: false},
  //     ]
  //   });
  // }

  /* Check/uncheck the tank type for supplier */
  $('#check_all').click(function () {
    var _this = this;
    $('.tank_type').find('input[name="tank_size"]').each(function () {
      if ($(_this).is(':checked')) {
        $(this).prop('checked', true);
      } else {
        $(this).prop('checked', false);
      }
    });
  });


  $('.tank_size').click(function () {
    var _this = this;
    var currentTank = $(this).val();
    var allChecked = true
    $('.tank_type').find('input[name="tank_size"]').each(function () {
      if (!$(_this).is(':checked') && currentTank != $(this).val()) {
        allChecked = false;
      }
    });
    if (allChecked) {
      $("#check_all").prop('checked', true);
    } else {
      $("#check_all").prop('checked', false);
    }
  });

})


/* On change country get city list */
function getCity(coutryId) {
  if (coutryId !== "" || coutryId !== undefined) {
    $.ajax({
      url: BASE_URL + '/city/getCityByCountry',
      data: {id: coutryId},
      type: 'POST',
      success: function (result) {
        console.log('Response', result);
        $('#city').empty();
        $('#city').append('<option value="">Select City</option>');
        $.each(result, function (i, obj) {
          $('#city').append('<option value="' + i + '">' + obj.name + '</option>');
        });
        $('#country_name').val($("#country option:selected").text());
      },
      error: function (textStatus, errorThrown) {
        alert('Something went wronge');
        location.reload();
      }
    });
  }
}

/* On change country get city list */
function getSubCity(cityId) {
  if (cityId !== "" || cityId !== undefined) {
    $('#city_name').val($("#city option:selected").text());
  }
}

/* Admin notification setting on off activity */
$('.btn-toggle').click(function () {
  $(this).find('.btn').toggleClass('active');
  // if ($(this).find('.btn-primary').size() > 0) {
  //   var action = ($(this).hasClass("is-user-notification")) ? "is-user-notification" : "is-device-notification";
  //   alert($(this).find('.btn').attr('data-value'));
  //   $.ajax({
  //     url: BASE_URL + '/dashboard/updateSetting',
  //     data: {type: action, value: $(this).find('.btn-primary').attr('data-value')},
  //     type: 'POST',
  //     success: function (result) {
  //       console.log("Status value:-", $(this).find('.btn-primary').attr('data-value'));
  //       $(this).find('.btn').toggleClass('btn-primary');
  //     },
  //     error: function (textStatus, errorThrown) {
  //       alert('Something went wronge', textStatus, errorThrown);
  //       //location.reload();
  //     }
  //   });
  //   $(this).find('.btn').toggleClass('btn-default');
  // }
  $(this).find('.btn').toggleClass('active');
  if ($(this).find('.btn-primary').size()>0) {
    $(this).find('.btn').toggleClass('btn-primary');
  }
  $(this).find('.btn').toggleClass('btn-default');

});


var autocomplete;

/* For google address API */
function initAutocomplete() {
  autocomplete = new google.maps.places.Autocomplete(
    (document.getElementById('area')),
    {types: ['geocode']});
  autocomplete.addListener('place_changed', fillInAddress);
}

/* Fill lat and long i*/
function fillInAddress() {
  // Get the place details from the autocomplete object.
  var place = autocomplete.getPlace();
  console.log("place", place.geometry.location.lat(), place.geometry.location.lng());
  $("#latitude").val(place.geometry.location.lat());
  $("#longitude").val(place.geometry.location.lng());
}

/* Bias the autocomplete object to the user's geographical location,
 as supplied by the browser's 'navigator.geolocation' object. */
function geolocate() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      console.log(position);
      var geolocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      var circle = new google.maps.Circle({
        center: geolocation,
        radius: position.coords.accuracy
      });
      autocomplete.setBounds(circle.getBounds());
    });
  }
}
