/*
 * Main set common settings of the application
 */

var BASE_URL = 'http://10.10.100.19:1337';

/* All message will be declared here */
var CONST = {
  MSGTIMEOUT: 4000,
}

$(document).ready(function () {
  /* Hide server side header messages */
  setTimeout(function(){
    $('div').removeClass('has-error');
    $('.form-group').find('.help-block').hide();
  },6000);

})
/*
 *  For manage all actions for the admin
 */

$(document).ready(function () {

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


  /* Search supplier */
  $('.search-supplier').click(function () {
    var text = $(".search").val();
    if (text != '') {
      $('#smallGlobalLoader').css('display', 'block');
      $('.seeMoreFollowList').css('display', 'none');
      $.ajax({
        url: BASE_URL + '/supplier/moreSupplier',
        type: 'POST',
        data: {
          offset: $('#offset').val(),
          limit: $('#limit').val(),
          count: $('#count').val(),
          text: $('.search').val()
        },
        success: function (response) {
          $('#offset').val(parseInt($('#offset').val()) + parseInt($('#limit').val()));
          $('#smallGlobalLoader').css('display', 'none');
          if (parseInt($('#offset').val()) >= parseInt($('#count').val())) {
            $('.pagination').html();
          } else {
            $('.seeMoreFollowList').css('display', 'block');
          }
          $('div.supplier-block').append(response);
        }, error: function (jqXHR, exception) {
          alert(jqXHR);
          alert(exception);
        }
      });
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
$('.change-notification').click(function () {
  $(".alert-danger").css("display", "none");
  $(".alert-success").css("display", "none");
  helper.showLoader();
  $(this).find('.btn').toggleClass('active');
  if ($(this).find('.btn-primary').size() > 0) {
    $(this).find('.btn').toggleClass('btn-primary');
  }
  $(this).find('.btn').toggleClass('btn-default');
  var action = ($(this).hasClass("is-user-notification")) ? "is_user_notification" : "is_device_notification";
  $.ajax({
    url: BASE_URL + '/dashboard/updateSetting',
    data: {type: action, value: $(this).find('.btn-primary').attr('data-value')},
    type: 'POST',
    success: function (result) {
      helper.hideLoader();
      $(".alert-success").css("display", "block");
      $(".alert-success").html(result.message);
    },
    error: function (textStatus, errorThrown) {
      helper.hideLoader();
      $(".alert-danger").css("display", "block");
      $(".alert-danger").html(textStatus);
    }
  });
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

/* parsley file upload velidation */
window.Parsley.addValidator('maxFileSize', {
  validateString: function (_value, maxSize, parsleyInstance) {
    if (!window.FormData) {
      alert('You are making all developpers in the world cringe. Upgrade your browser!');
      return true;
    }
    var files = parsleyInstance.$element[0].files;
    return files.length != 1 || files[0].size <= maxSize * 1024;
  },
  requirementType: 'integer',
  messages: {
    en: 'Company logo should not be larger than 4 Mb',
  }
});


/* Declare all helper functions here */
var helper = {
  /*
   * @method: checkResponse
   * @desc: CHeck error messages in response
   */
  checkResponse: function (response) {
    if (response.status == false && typeof response.errors != 'undefined' && response.errors.length > 0) {
      var message = '';
      response.errors.forEach(function (val) {
        message += val + '\n';
      })
      $.notify(message, "error");
    }
    return response;
  },
  /*
   * @method: showLoader
   * @desc: Show loader
   */
  showLoader: function () {
    $(".splash").show();
  },
  /*
   * @method: hideLoader
   * @desc: hide loader
   */
  hideLoader: function () {
    $(".splash").hide();
  },
  /*
   * @method: deleteConfirmation
   * @desc: Delete confirmation dialog
   * @param fn: function execute after the cofirm
   */
  deleteConfirmation: function (fn) {
    swal({
        title: "Are you sure?",
        text: "You will not be able to recover!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: '#DD6B55',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: "No, cancel please!",
        closeOnCancel: true
      },
      function (isConfirm) {
        if (isConfirm) {
          fn();
        }
      });
  }


}

/* Make activate/deactivate a record */
$("body").on("click", ".status-action", function () {
  $(".alert-danger").css("display", "none");
  $(".alert-success").css("display", "none");
  helper.showLoader();
  var id = $(this).attr('data-id');
  if ($(this).attr('data-status') == 'true') {
    var status = false;
  } else if ($(this).attr('data-status') == 'false') {
    var status = true;
  }
  var url = $(this).attr('data-url');
  if (id != '' && url != '') {
    var formData = {
      id: id,
      is_active: status
    };
    $.ajax({
      type: "POST",
      url: url,
      data: formData,
      success: function (result) {
        jQuery('#city-grid, #device-grid, #location-grid, #user-grid').jqGrid('clearGridData');
        jQuery('#city-grid, #device-grid, #location-grid, #user-grid').jqGrid('setGridParam', {datatype:'json'});
        jQuery('#city-grid, #device-grid, #location-grid, #user-grid').trigger('reloadGrid');
        helper.hideLoader();
        $(".alert-success").css("display", "block");
        $(".alert-success").html(result.message);
      },
      error: function (textStatus, errorThrown) {
        helper.hideLoader();
        $(".alert-danger").css("display", "block");
        $(".alert-danger").html(textStatus);
      }
    });
  }
})


/* supplier pagination code */
function showMyTrips() {
  $('#smallGlobalLoader').css('display', 'block');
  $('.seeMoreFollowList').css('display', 'none');
  $.ajax({
    url: BASE_URL + '/supplier/moreSupplier',
    type: 'POST',
    data: {offset: $('#offset').val(), limit: $('#limit').val(), count: $('#count').val()},
    success: function (response) {
      helper.hideLoader();
      $(".alert-success").css("display", "block");
      $(".alert-success").html(result.message);
      $('#offset').val(parseInt($('#offset').val()) + parseInt($('#limit').val()));
      $('#smallGlobalLoader').css('display', 'none');
      if (parseInt($('#offset').val()) >= parseInt($('#count').val())) {
        $('.pagination').html();
      } else {
        $('.seeMoreFollowList').css('display', 'block');
      }
      $('div.supplier-block').append(response);
    }, error: function (jqXHR, exception) {
      helper.hideLoader();
      $(".alert-danger").css("display", "block");
      $(".alert-danger").html(textStatus);
    }
  });
}

/* Show grid */
$(document).ready(function () {
  var status = false;
  $("#city-grid").jqGrid({
    url: BASE_URL + '/city/cityList',
    mtype: "GET",
    datatype: "json",
    colModel: [
      {label: 'City', name: 'name', width: 300, search: true},
      {label: 'Country', name: 'country_name', width: 150},
      {
        label: 'Status', name: 'is_deleted', width: 100, search: false,
        formatter: function (cellvalue) {
          status = cellvalue;
          return (cellvalue == false) ? "Active" : "In active";
        }
      },
      {
        label: 'Action', name: 'city_id', search: false, width: 150, align: "center",
        formatter: function (cellvalue) {
          var action = '<a title="View Location" href="' + BASE_URL + '/city/view/' + cellvalue + '" ><i class="fa fa-eye"></i></a>';
          action += '<a title="Edit City" href="' + BASE_URL + '/city/edit/' + cellvalue + '" ><i class="fa fa-edit"></i></a>';
          if (status == 'true' || status == true) {
            action += '<a data-tooltip="" title="" data-status="true" data-url="' + BASE_URL + '/city/updateStatus/' + cellvalue + '" class="button status-action active" data-id="' + cellvalue + '" href="javascript:void(0);" data-original-title="Active"><i class="fa fa-check-square-o"></i></a>';
          } else {
            action += '<a data-tooltip="" title="" data-status="false" data-url="' + BASE_URL + '/city/updateStatus/' + cellvalue + '" class="button status-action active" data-id="' + cellvalue + '" href="javascript:void(0);" data-original-title="In Active"><i class="fa fa-square-o"></i></a>';
          }
          return action;
        }
      }
    ],
    viewrecords: true,
    width: 1110,
    height: 250,
    rowNum: 10,
    loadonce: true,
    gridview: true,
    pager: "#city-grid-pager",
  });
  jQuery("#city-grid").jqGrid('filterToolbar', {
    searchOperators: true, stringResult: true, searchOnEnter: false
  });

  /* Contact page grid */
  $("#contact-grid").jqGrid({
    url: BASE_URL + '/contact/contactList',
    mtype: "GET",
    datatype: "json",
    colModel: [
      {label: 'Name', name: 'name', width: 250, search: true},
      {label: 'Email', name: 'email', width: 300, search: true},
      {label: 'Query', name: 'query', width: 450},
      {
        label: 'Action', name: 'contact_id', search: false, width: 150, align: "center",
        formatter: function (cellvalue) {
          var action = '<a href="' + BASE_URL + '/contact/view/' + cellvalue + '" ><i class="fa fa-eye"></i></a>';
          return action;
        }
      }
    ],
    viewrecords: true,
    width: 1110,
    height: 250,
    rowNum: 10,
    loadonce: true,
    gridview: true,
    pager: "#contact-grid-pager",
    /*guiStyle: "bootstrap",*/
  });
  jQuery("#contact-grid").jqGrid('filterToolbar', {searchOperators: true, stringResult: true, searchOnEnter: false});

  /* Devide page grid */

  var status = false;
  $("#device-grid").jqGrid({
    url: BASE_URL + '/device/deviceList',
    mtype: "GET",
    datatype: "json",
    colModel: [
      {label: 'Device Id', name: 'device_id', width: 150, search: true},
      {
        label: 'Device Name', name: 'name', width: 300, search: true,
        formatter: function (cellvalue) {
          return (cellvalue == undefined) ? "--" : cellvalue;
        }
      },
      {
        label: 'User Name', name: 'phone', width: 150,
        formatter: function (cellvalue) {
          return (cellvalue == undefined) ? "Not Assigned" : cellvalue;
        }
      },
      {
        label: 'Location', name: 'area', width: 250,
        formatter: function (cellvalue) {
          return (cellvalue == undefined) ? "--" : cellvalue;
        }
      },
      {
        label: 'Last Inactive Time', name: 'city_name', width: 150, search: false,
        formatter: function (cellvalue) {
          return (cellvalue == undefined) ? "--" : cellvalue;
        }
      },
      {
        label: 'Status', name: 'is_deleted', width: 100, search: false,
        formatter: function (cellvalue) {
          status = cellvalue;
          return (cellvalue == false) ? "Active" : "In active";
        }
      },
      {
        label: 'Action', name: 'device_unique_id', search: false, width: 150, align: "center",
        formatter: function (cellvalue) {
          var action = '<a title="View Device Detail" href="' + BASE_URL + '/device/view/' + cellvalue + '" ><i class="fa fa-eye"></i></a>';
          action += '<a title="Edit Device Detail" href="' + BASE_URL + '/device/edit/' + cellvalue + '" ><i class="fa fa-edit"></i></a>';
          if (status == 'true' || status == true) {
            action += '<a data-tooltip="" title="Active" data-status="true" data-url="' + BASE_URL + '/device/updateStatus/' + cellvalue + '" class="button status-action active" data-id="' + cellvalue + '" href="javascript:void(0);" data-original-title="Active"><i class="fa fa-check-square-o"></i></a>';
          } else {
            action += '<a data-tooltip="" title="In Active" data-status="false" data-url="' + BASE_URL + '/device/updateStatus/' + cellvalue + '" class="button status-action active" data-id="' + cellvalue + '" href="javascript:void(0);" data-original-title="In Active"><i class="fa fa-square-o"></i></a>';
          }
          return action;
        }
      }
    ],
    viewrecords: true,
    width: 1110,
    height: 250,
    rowNum: 10,
    loadonce: true,
    gridview: true,
    pager: "#device-grid-pager",
    /*guiStyle: "bootstrap",*/
  });
  jQuery("#device-grid").jqGrid('filterToolbar', {searchOperators: true, stringResult: true, searchOnEnter: false});

  /* Location page grid */
  var status = false;
  $("#location-grid").jqGrid({
    url: BASE_URL + '/city/locationList',
    postData: {cityId: $("#city_id").val()},
    mtype: "GET",
    datatype: "json",
    colModel: [
      {label: 'Sub City', name: 'name', width: 300, search: true},
      {label: 'City', name: 'city_name', width: 150},
      {
        label: 'Status', name: 'is_deleted', width: 100,
        formatter: function (cellvalue) {
          status = cellvalue;
          return (cellvalue == false) ? "Active" : "In active";
        }
      },
      {
        label: 'Action', name: 'city_id', search: false, width: 150, align: "center",
        formatter: function (cellvalue) {
          var action = '<a href="' + BASE_URL + '/city/editLocation/' + cellvalue + '" ><i class="fa fa-edit"></i></a>';
          if (status == 'true' || status == true) {
            action += '<a data-tooltip="" title="" data-status="true" data-url="' + BASE_URL + '/city/updateLocationStatus/' + cellvalue + '" class="button status-action active" data-id="' + cellvalue + '" href="javascript:void(0);" data-original-title="Active"><i class="fa fa-check-square-o"></i></a>';
          } else {
            action += '<a data-tooltip="" title="" data-status="false" data-url="' + BASE_URL + '/city/updateLocationStatus/' + cellvalue + '" class="button status-action active" data-id="' + cellvalue + '" href="javascript:void(0);" data-original-title="In Active"><i class="fa fa-square-o"></i></a>';
          }
          return action;
        }
      }
    ],
    viewrecords: true,
    width: 1110,
    height: 250,
    rowNum: 10,
    loadonce: true,
    gridview: true,
    pager: "#location-grid-pager",
    /*guiStyle: "bootstrap",*/
  });
  jQuery("#location-grid").jqGrid('filterToolbar', {searchOperators: true, stringResult: true, searchOnEnter: false});

  /* User listing grid */
  $("#user-grid").jqGrid({
    url: BASE_URL + '/user/userlist',
    mtype: "GET",
    datatype: "json",
    colModel: [
      {label: 'Name', name: 'name', width: 200, search: true},
      {label: 'Email', name: 'email', width: 320, search: true},
      {label: 'Contact Number', name: 'phone', width: 150, align: "right"},
      {label: 'Location', name: 'area', width: 250},
      {label: 'City', name: 'city_name', width: 150},
      {label: 'Country', name: 'country_name', width: 130},
      {
        label: 'Status', name: 'is_deleted', width: 100, search: false,
        formatter: function (cellvalue) {
          status = cellvalue;
          return (cellvalue == false) ? "Active" : "In active";
        }
      },
      {
        label: 'Action', name: 'user_id', search: false, width: 150, align: "center",
        formatter: function (cellvalue) {
          var action = '<a title="View User Detail" href="' + BASE_URL + '/user/view/' + cellvalue + '" ><i class="fa fa-eye"></i></a>';
          action += '<a title="Edit User Detail" href="' + BASE_URL + '/user/edit/' + cellvalue + '" ><i class="fa fa-edit"></i></a>';
          if (status == 'true' || status == true) {
            action += '<a data-tooltip="" title="Active" data-status="true" data-url="' + BASE_URL + '/user/updateStatus/' + cellvalue + '" class="button status-action active" data-id="' + cellvalue + '" href="javascript:void(0);" data-original-title="Active"><i class="fa fa-check-square-o"></i></a>';
          } else {
            action += '<a data-tooltip="" title="In Active" data-status="false" data-url="' + BASE_URL + '/user/updateStatus/' + cellvalue + '" class="button status-action active" data-id="' + cellvalue + '" href="javascript:void(0);" data-original-title="In Active"><i class="fa fa-square-o"></i></a>';
          }
          return action;
        }
      }
    ],
    viewrecords: true,
    width: 1110,
    height: 250,
    rowNum: 10,
    loadonce: true,
    gridview: true,
    pager: "#user-grid-pager",
    /*guiStyle: "bootstrap",*/
  });
  jQuery("#user-grid").jqGrid('filterToolbar', {searchOperators: true, stringResult: true, searchOnEnter: false});

});
