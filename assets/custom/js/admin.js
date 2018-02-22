/*
 * Main set common settings of the application
 */
/* All message will be declared here */
var CONST = {
  MSGTIMEOUT: 10000,
}


$(document).ready(function () {
  /* Hide server side header messages */
  setTimeout(function () {
    $('div').removeClass('has-error');
    $('.form-group').find('.help-block').hide();
  }, 8000);

  setTimeout(function () {
    $('.flash-message').remove();
  }, 8000);

  $.ajax({
    url: BASE_URL + '/login/getAdminNotification',
    type: 'POST',
    success: function (response) {
      if(response.indexOf('<title>') !== -1){
        $('.notification-tab').html('')
      }else{
        $('.notification-tab').html(response)
      }
    }, error: function (jqXHR, exception) {
      alert(jqXHR);
      alert(exception);
    }
  });



  /* disable paste in field */
  // $('input.disable-paste').bind('paste', function (e) {
  //   e.preventDefault();
  // });

  //Grid  Defaul Width Set
  $.jgrid.defaults.width = $(window).width() - 95;
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
    if ($('.tank_size:checked').length == $('.tank_size').length) {
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
          $('button.clr-search-supplier').css("display", "block");
          $('div.supplier-block').html(response);
        }, error: function (jqXHR, exception) {
          alert(jqXHR);
          alert(exception);
        }
      });
    }
  });


  /* Clear Search supplier */
  $('.clr-search-supplier').click(function () {
    var text = $(".search").val('');
    $('button.clr-search-supplier').css("display", "none");
  });


  /* On submit form Disable submit button */
  $(".form-submit").on('submit', function(e){
    if ($(this).parsley().isValid()) {
      $(':submit').prop("disabled", "disabled");
    }
  });

})


/* On change country get city list */
function getCity(coutryId) {
  if (coutryId != "") {
    $.ajax({
      url: BASE_URL + '/city/getCityByCountry',
      data: {id: coutryId},
      type: 'POST',
      success: function (result) {
        $('#area').removeAttr("disabled");
        $('#city').empty();
        $('#city').append('<option value="">Select City</option>');
        $.each(result, function (i, obj) {
          $('#city').append('<option value="' + i + '">' + obj.name + '</option>');
        });
        $('#country_name').val($("#country option:selected").text());

        /* get country code*/
        $.ajax({
          url: BASE_URL + '/city/getCountryCode',
          data: {id: coutryId},
          type: 'POST',
          success: function (result) {
            $('#country_code').val(result);
          },
          error: function (textStatus, errorThrown) {
            alert('Something went wronge');
            location.reload();
          }
        });
      },
      error: function (textStatus, errorThrown) {
        alert('Something went wronge');
        location.reload();
      }
    });
  } else {
    $("#area").prop("disabled", "disabled");
  }
}

/* On change country get city list */
function getSubCity(cityId) {
  if (cityId !== "") {
    $.ajax({
      url: BASE_URL + '/city/getLocationByCity',
      data: {id: cityId},
      type: 'POST',
      success: function (result) {
        $('#area').empty();
        $('#area').append('<option value="">Select Area</option>');
        $.each(result, function (i, obj) {
          $('#area').append('<option value="' + i + '">' + obj.name + '</option>');
        });
        $('#city_name').val($("#city option:selected").text());
      },
      error: function (textStatus, errorThrown) {
        alert('Something went wronge');
        location.reload();
      }
    });
  }
}


/* On change country set location */
function getLocation(locationId) {
  if (locationId !== "") {
    $('#area_name').val($("#area option:selected").text());
  }
}

/* show image preview on select image*/
function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      $('#image-preview').attr('src', e.target.result);
    }
    reader.readAsDataURL(input.files[0]);
  }
}

$("#image").change(function(){
  readURL(this);
});



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
  setTimeout(function () {
    $('div.alert').css('display', "none");
  }, 8000);
});


var autocomplete;

/* For google address API */
function initAutocomplete() {
  var options = {
    types: ['(cities)'],
    componentRestrictions: {country: "in"}
  };
  autocomplete = new google.maps.places.Autocomplete(
    (document.getElementById('area')),
    {types: ['geocode']});
  autocomplete.addListener('place_changed', fillInAddress);
}

/* Fill lat and long i*/
function fillInAddress() {
  // Get the place details from the autocomplete object.
  var place = autocomplete.getPlace();
  $("#latitude").val(place.geometry.location.lat());
  $("#longitude").val(place.geometry.location.lng());
}

/* Bias the autocomplete object to the user's geographical location,
 as supplied by the browser's 'navigator.geolocation' object. */
function geolocate() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
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
window.Parsley
  .addValidator('maxFileSize', {
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
  })
  .addValidator('filemimetypes', {
    requirementType: 'string',
    validateString: function (_value, requirement, parsleyInstance) {
      var file = parsleyInstance.$element[0].files;
      if (file.length == 0) {
        return true;
      }
      var allowedMimeTypes = requirement.replace(/\s/g, "").split(',');
      return allowedMimeTypes.indexOf(file[0].type) !== -1;
    },
    messages: {
      en: 'Please upload only image'
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
  var isSupplier = $(this).attr('data-supplier');
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
        if (isSupplier == 'true') {
          location.reload();
        } else {
          jQuery('[data-original-title="Make Active"]').tooltip('destroy');
          jQuery('[data-original-title="Make In Active"]').tooltip('destroy');
          jQuery('#city-grid, #device-grid, #location-grid, #user-grid, #contact-grid, #admin-grid').jqGrid('clearGridData');
          jQuery('#city-grid, #device-grid, #location-grid, #user-grid, #contact-grid, #admin-grid').jqGrid('setGridParam', {datatype: 'json'});
          jQuery('#city-grid, #device-grid, #location-grid, #user-grid, #contact-grid, #admin-grid').trigger('reloadGrid');
          helper.hideLoader();
          $(".alert-success").css("display", "block");
          $(".alert-success").html(result.message);
        }
      },
      error: function (textStatus, errorThrown) {
        helper.hideLoader();
        $(".alert-danger").css("display", "block");
        $(".alert-danger").html(textStatus);
      }
    });
    setTimeout(function () {
      $('div.alert').css('display', "none");
    }, 6000);
  }
})



$("body").on("click", ".delete-action", function () {
  if (confirm($(this).attr('data-alert-message'))) {
    helper.showLoader();
    var url = $(this).attr('data-url');
    var id = $(this).attr('data-id');
    if (id != '' && url != '') {
      var formData = {
        id: id
      };
      $.ajax({
        type: "POST",
        url: url,
        data: formData,
        success: function (result) {
          location.reload();
        },
        error: function (textStatus, errorThrown) {
          helper.hideLoader();
          $(".alert-danger").css("display", "block");
          $(".alert-danger").html(textStatus);
        }
      });
    }
  }
});




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
  setTimeout(function () {
    $('div.alert').css('display', "none");
  }, 6000);
}

/* Show grid */
$(document).ready(function () {
  /* Admin grid */
  var status = false;
  var user_id = false;
  $("#admin-grid").jqGrid({
    url: BASE_URL + '/admin/adminList',
    mtype: "GET",
    datatype: "json",
    colModel: [
      {label: 'Name', name: 'name', width: 300, search: true, classes: 'text-break'},
      {label: 'Email', name: 'email', width: 300, search: true, classes: 'text-break',autocomplete:"off"},
      {label: 'Mobile', name: 'phone', width: 300, search: true, classes: 'text-break'},
      {
        name: 'id', hidden: true,
        formatter: function (cellvalue) {
          user_id = cellvalue;
        }
      },
      {
        label: 'Status', name: 'is_deleted', width: 100, align: "center", search: false,
        formatter: function (cellvalue) {
          statusAction = ''
          if (cellvalue == 'true' || cellvalue == true) {
            statusAction += '<a data-tooltip="" title="Make Active" data-status="true" data-url="' + BASE_URL + '/admin/updateStatus" class="button status-action active" data-id="' + user_id + '" href="javascript:void(0);" data-original-title="In Active"><i class="fa fa-circle in-active"></i></a>';
          } else {
            statusAction += '<a data-tooltip="" title="Make In Active" data-status="false" data-url="' + BASE_URL + '/admin/updateStatus" class="button status-action active" data-id="' + user_id + '" href="javascript:void(0);" data-original-title="Active"><i class="fa fa-circle active"></i></a>';
          }
          return statusAction;
        }
      },
      {
        label: 'Action', name: 'id', search: false, width: 150, align: "right",
        formatter: function (cellvalue) {
          var action = '<div class="td-action">';
          action += '<span><a title="View Admin" href="' + BASE_URL + '/admin/view/' + cellvalue + '" ><i class="fa fa-eye"></i></a></span>';
          action += '<span><a title="Edit Admin" href="' + BASE_URL + '/admin/edit/' + cellvalue + '" ><i class="fa fa-edit"></i></a></span>';
          action += '<span><a data-alert-message="Are you sure you want to delete this admin?" title="Delete Admin" href="' + BASE_URL + '/admin/delete/' + cellvalue + '" ><i class="fa fa-trash-o"></i></a></span>';
          action += '</div>';
          return action;
        }
      }
    ],
    viewrecords: true,
    autocomplete:"off",
    height: 480,
    rowNum: 10,
    loadonce: true,
    gridview: true,
    rowList: [10, 20, 50],
    pager: "#admin-grid-pager",
  });
  jQuery("#admin-grid").jqGrid('filterToolbar', {
    searchOperators: true, stringResult: true, searchOnEnter: false
  });


  var status = false;
  $("#city-grid").jqGrid({
    url: BASE_URL + '/city/cityList',
    mtype: "GET",
    datatype: "json",
    colModel: [
      {label: 'City', name: 'name', width: 300, search: true, classes: 'text-break'},
      {label: 'Country', name: 'country_name', width: 150, classes: 'text-break'},
      {
        name: 'city_id', hidden: true,
        formatter: function (cellvalue) {
          city_id = cellvalue;
        }
      },
      {
        label: 'Status', name: 'is_deleted', width: 100, search: false, align: "center",
        formatter: function (cellvalue) {
          statusAction = ''
          if (cellvalue == 'true' || cellvalue == true) {
            statusAction += '<a data-tooltip="" title="Make Active" data-status="true" data-url="' + BASE_URL + '/city/updateStatus" class="button status-action active" data-id="' + city_id + '" href="javascript:void(0);" data-original-title="In Active"><i class="fa fa-circle in-active"></i></a>';
          } else {
            statusAction += '<a title="Make In Active" data-status="false" data-url="' + BASE_URL + '/city/updateStatus" class="button status-action active" data-id="' + city_id + '" href="javascript:void(0);" data-original-title="Active"><i class="fa fa-circle active"></i></a>';
          }
          return statusAction;
        }
      },
      {
        label: 'Action', name: 'city_id', search: false, width: 150, align: "right",
        formatter: function (cellvalue) {
          var action = '<div class="td-action">';
          action += '<span><a title="View Location" href="' + BASE_URL + '/city/view/' + cellvalue + '" ><i class="fa fa-eye"></i></a></span>';
          action += '<span><a title="Edit City" href="' + BASE_URL + '/city/edit/' + cellvalue + '" ><i class="fa fa-edit"></i></a></span>';
          action += '<span><a class="delete-action" data-id="' + cellvalue + '" href="javascript:void(0);" data-alert-message="Are you sure you want to delete this city? By deleting the city all associated area will be deleted" data-url="' + BASE_URL + '/city/delete/' + cellvalue + '" ><i class="fa fa-trash-o"></i></a></span>';
          action += '</div>';
          return action;
        }
      }
    ],
    viewrecords: true,
    autocomplete:"off",
    height: 480,
    rowNum: 10,
    loadonce: true,
    gridview: true,
    rowList: [10, 20, 50],
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
      {label: 'Name', name: 'name', width: 250, search: true, classes: 'text-break'},
      {label: 'Email', name: 'email', width: 300, search: true},
      {label: 'Query', name: 'query', width: 450, classes: 'text-break'},
      {
        name: 'contact_id', hidden: true,
        formatter: function (cellvalue) {
          contact_id = cellvalue;
        }
      },
      {
        label: 'Status', name: 'is_deleted', width: 100, search: false, align: "center",
        formatter: function (cellvalue) {
          statusAction = ''
          if (cellvalue == 'true' || cellvalue == true) {
            statusAction += '<a data-tooltip="" title="Mark As Incomplete" data-status="true" data-url="' + BASE_URL + '/contact/updateStatus" class="button status-action active" data-id="' + contact_id + '" href="javascript:void(0);" data-original-title="In Active"><i class="fa fa-circle in-active"></i></a>';
          } else {
            statusAction += '<a data-tooltip="" title="Mark As Complete" data-status="false" data-url="' + BASE_URL + '/contact/updateStatus" class="button status-action active" data-id="' + contact_id + '" href="javascript:void(0);" data-original-title="Active"><i class="fa fa-circle active"></i></a>';
          }
          return statusAction;
        }
      },
      {
        label: 'Action', name: 'contact_id', search: false, width: 150, align: "right",
        formatter: function (cellvalue) {
          var action = '<div class="td-action">';
          action += '<span><a title="View Enquiry" href="' + BASE_URL + '/contact/view/' + cellvalue + '" ><i class="fa fa-eye"></i></a></span>';
          action += '</div>';
          return action;
        }
      }
    ],
    viewrecords: true,
    //width: 1110,
    height: 480,
    rowNum: 10,
    loadonce: true,
    gridview: true,
    rowList: [10, 20, 50],
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
      {label: 'Device Id (Android)', name: 'device_id', width: 200, search: true},
      {label: 'Device Id (IPhone)', name: 'device_id_iphone', width: 410, search: true},
      {
        label: 'Device Name', name: 'device_name', width: 150, search: true, classes: 'text-break',
        formatter: function (cellvalue) {
          return (cellvalue == undefined) ? "NA" : cellvalue;
        }
      },
      {
        label: 'User Name', name: 'user_name', width: 150, classes: 'text-break',
        formatter: function (cellvalue) {
          return (cellvalue == undefined) ? "NA" : cellvalue;
        }
      },
      {
        label: 'Last Reading Time', name: 'last_reading', width: 190, search: false,
        formatter: function (cellvalue) {
          return (cellvalue == undefined) ? "NA" : cellvalue;
        }
      },
      {
        name: 'device_key', hidden: true,
        formatter: function (cellvalue) {
          device_unique_id = cellvalue;
        }
      },
      {
        label: 'Status', name: 'is_deleted', width: 90, search: false, align: "center",
        formatter: function (cellvalue) {
          statusAction = ''
          if (cellvalue == 'true' || cellvalue == true) {
            statusAction += '<a data-tooltip="" title="Make Active" data-status="true" data-url="' + BASE_URL + '/device/updateStatus" class="button status-action active" data-id="' + device_unique_id + '" href="javascript:void(0);" data-original-title="In Active"><i class="fa fa-circle in-active"></i></a>';
          } else {
            statusAction += '<a data-tooltip="" title="Make In Active" data-status="false" data-url="' + BASE_URL + '/device/updateStatus" class="button status-action active" data-id="' + device_unique_id + '" href="javascript:void(0);" data-original-title="Active"><i class="fa fa-circle active"></i></a>';
          }
          return statusAction;
        }
      },
      {
        label: 'Action', name: 'device_key', search: false, width: 120, align: "right",
        formatter: function (cellvalue) {
          var action = '<div class="td-action">';
          action += '<span><a title="View Device Detail" href="' + BASE_URL + '/device/view/' + cellvalue + '" ><i class="fa fa-eye"></i></a></span>';
          action += '<span><a title="Edit Device Detail" href="' + BASE_URL + '/device/edit/' + cellvalue + '" ><i class="fa fa-edit"></i></a></span>';
          action += '<span><a class="delete-action" data-id="' + cellvalue + '" href="javascript:void(0);"  data-alert-message="Are you sure you want to delete this device? By deleting the device all associated device reading will be deleted." title="Delete Device" data-url="' + BASE_URL + '/device/delete/' + cellvalue + '" ><i class="fa fa-trash-o"></i></a></span>';
          action += '</div>';
          return action;
        }
      }
    ],
    viewrecords: true,
    //width: 1110,
    height: 480,
    rowNum: 10,
    loadonce: true,
    gridview: true,
    rowList: [10, 20, 50],
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
      {label: 'Location', name: 'name', width: 300, search: true, classes: 'text-break'},
      {label: 'City', name: 'city_name', width: 150, classes: 'text-break'},
      {
        name: 'city_id', hidden: true,
        formatter: function (cellvalue) {
          location_id = cellvalue;
        }
      },
      {
        label: 'Status', name: 'is_deleted', width: 100, search: false,
        formatter: function (cellvalue) {
          statusAction = ''
          if (cellvalue == 'true' || cellvalue == true) {
            statusAction += '<a data-tooltip="" title="Make Active" data-status="true" data-url="' + BASE_URL + '/city/updateLocationStatus" class="button status-action active" data-id="' + location_id + '" href="javascript:void(0);" data-original-title="In Active"><i class="fa fa-circle in-active"></i></a>';
          } else {
            statusAction += '<a data-tooltip="" title="Make In Active" data-status="false" data-url="' + BASE_URL + '/city/updateLocationStatus" class="button status-action active" data-id="' + location_id + '" href="javascript:void(0);" data-original-title="Active"><i class="fa fa-circle active"></i></a>';
          }
          return statusAction;
        }
      },
      {
        label: 'Action', name: 'city_id', search: false, width: 150, align: "right",
        formatter: function (cellvalue) {
          var action = '<div class="td-action">';
          action += '<span><a title="Edit Location" href="' + BASE_URL + '/city/editLocation/' + cellvalue + '" ><i class="fa fa-edit"></i></a></span>';
          action += '<span><a class="delete-action" data-id="' + cellvalue + '" href="javascript:void(0);" data-alert-message="Are you sure you want to delete this location?" title="Delete Location" data-url="' + BASE_URL + '/city/deleteLocation/' + cellvalue + '" ><i class="fa fa-trash-o"></i></a></span>';
          action += '</div>';
          return action;
        }
      }
    ],
    viewrecords: true,
    height: 480,
    rowNum: 10,
    loadonce: true,
    gridview: true,
    rowList: [10, 20, 50],
    pager: "#location-grid-pager",
    /*guiStyle: "bootstrap",*/
  });
  jQuery("#location-grid").jqGrid('filterToolbar', {searchOperators: true, stringResult: true, searchOnEnter: false});

  /* User listing grid */
  var user_id = '';
  $("#user-grid").jqGrid({
    url: BASE_URL + '/user/userlist',
    mtype: "GET",
    datatype: "json",
    colModel: [
      {
        label: ' ', name: 'profile_picture', width: 60, search: false, classes: 'user-avatar-cell',
        formatter: function (cellvalue) {
          if (cellvalue != undefined && cellvalue != '') {
            return '<span class="user-location" ' + 'style="background-image:url(' + cellvalue + ')">';
          } else {
            return '<span class="user-location" ' + 'style="background-image:url(' + BASE_URL + '/images/avatar.png)">';
          }
        }
      },
      {label: 'Name', name: 'name', width: 170, search: true, classes: 'text-break'},
      {label: 'Email', name: 'email', width: 280, search: true},
      {label: 'Contact Number', name: 'phone', width: 150, align: "center"},
      {
        label: 'Address', name: 'address', width: 150, align: "center", search: true, classes: 'text-break',
      },
      /*{label: 'City', name: 'city_name', width: 150},*/
      {
        name: 'user_id', hidden: true,
        formatter: function (cellvalue) {
          user_id = cellvalue;
        }
      },
      /*{
        label: 'Country', name: 'country_name', width: 80, search: false,
        formatter: function (cellvalue) {
          return '<span class="user-location" style="background-image:url(https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Flag_of_India.svg/255px-Flag_of_India.svg.png)"></span>';
        }
      },*/
      {
        label: 'Device', name: 'device', width: 100, search: false, classes: 'text-break'
      },
      {
        label: 'Status', name: 'is_deleted', width: 80, search: false, align: "center",
        formatter: function (cellvalue) {
          statusAction = ''
          if (cellvalue == 'true' || cellvalue == true) {
            statusAction += '<a data-tooltip="" title="Make Active" data-status="true" data-url="' + BASE_URL + '/user/updateStatus" class="button status-action active" data-id="' + user_id + '" href="javascript:void(0);" data-original-title="In Active"><i class="fa fa-circle in-active"></i></a>';
          } else {
            statusAction += '<a data-tooltip="" title="Make In Active" data-status="false" data-url="' + BASE_URL + '/user/updateStatus" class="button status-action active" data-id="' + user_id + '" href="javascript:void(0);" data-original-title="Active"><i class="fa fa-circle active"></i></a>';
          }
          return statusAction;
        }
      },
      {
        label: 'Action', name: 'user_id', search: false, width: 120, align: "right",
        formatter: function (cellvalue) {
          var action = '<div class="td-action">';
          action += '<span><a title="View User Detail" href="' + BASE_URL + '/user/view/' + cellvalue + '" ><i class="fa fa-eye"></i></a></span>';
          action += '<span><a title="Edit User Detail" href="' + BASE_URL + '/user/edit/' + cellvalue + '" ><i class="fa fa-edit"></i></a></span>';
          action += '<span><a data-id="' + cellvalue + '" data-alert-message="Are you sure you want to delete this user by deleting the user all associated device will be deleted" data-url="' + BASE_URL + '/user/delete/' + cellvalue + '" class="delete-action" title="Delete User" href="javascript:void(0);" ><i class="fa fa-trash-o"></i></a></span>';
          action += '</div>';
          return action;
        }
      }
    ],
    viewrecords: true,
    //width: 1110,
    height: 480,
    rowNum: 10,
    rowList: [10, 20, 50],
    loadonce: true,
    gridview: true,
    pager: "#user-grid-pager",
    /*guiStyle: "bootstrap",*/
  });
  jQuery("#user-grid").jqGrid('filterToolbar', {searchOperators: true, stringResult: true, searchOnEnter: false});

  /*Disable auto complete of on the input filed of the grid */
  $(".ui-widget-content").attr("autocomplete", "off");
});

