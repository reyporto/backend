var customSearch = false;

$(document).ready(function() {
  $('.lista').hide();
  $("#rangoPrecio").ionRangeSlider({
    type: "double",
    grid: false,
    min: 0,
    max: 100000,
    from: 1000,
    to: 20000,
    prefix: "$"
  });

  cities();
  types();
});

var ajax = (url, type, data) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: url,
      type: type,
      data: data
    }).done((res) => {
      resolve(res);
    }).fail((err) => {
      reject(err);
    });
  });
}

var processPlaces = (places) => {
  var cards = '';
  
  for (var place of places) {
    cards += processPlace(place);
  }

  $('.lista').html('');
  $('.lista').append(cards);
  $('.lista').show();
}

var processPlace = (place) => {
  return `<div class="card horizontal">
            <div class="card-image">
              <img src="img/home.jpg">
            </div>
            <div class="card-stacked">
              <div class="card-content">
                <div>
                  <b>Direccion: </b>${place.Direccion}<p></p>
                </div>
                <div>
                  <b>Ciudad: </b>${place.Ciudad}<p></p>
                </div>
                <div>
                  <b>Telefono: </b>${place.Telefono}<p></p>
                </div>
                <div>
                  <b>Código postal: </b>${place.Codigo_Postal}<p></p>
                </div>
                <div>
                  <b>Precio: </b>${place.Precio}<p></p>
                </div>
                <div>
                  <b>Tipo: </b>${place.Tipo}<p></p>
                </div>
              </div>
              <div class="card-action right-align">
                <a href="#">Ver más</a>
              </div>
            </div>
          </div>`;
}

var cities = () => {
  ajax('/api/cities', 'POST', {}).then(function(data) {
    if (data.response.code === '1') {
      loadSelect(data.response.data, 'ciudad');
    }
  }).catch(function(error) {
    console.log(error);
  });
}

var types = () => {
  ajax('/api/types', 'POST', {}).then(function(data) {
    if (data.response.code === '1') {
      loadSelect(data.response.data, 'tipo');
    }
  }).catch(function(error) {
    console.log(error);
  });
}

var loadSelect = (items, id) => {
  var select = $('#' + id);

  for (var item of items) {
    select.append($('<option>', {
        value: item,
        text: item
    }));
  }

  select.material_select();
}

var empty = (message) => {
  $('.lista').html('');
  $('.lista').append(`<h4>${message}</h4>`);
  $('.lista').show();
}

$(document).on('change', '#checkPersonalizada', function() {
  customSearch = customSearch ? false : true;
  $('#personalizada').toggleClass('invisible');
});

$(document).on('click', '#buscar', function() {
  if (customSearch) {
    var city = $('#ciudad').find(':selected').val();
    var type = $('#tipo').find(':selected').val();
    var price = $('#rangoPrecio').val();

    ajax('/api/filter/data', 'POST', {
      city: city,
      type: type,
      price: price
    }).then(function(data) {
      if (data.response.code === '1') {
        processPlaces(data.response.data);
      } else if (data.response.code === '0') {
        empty(data.response.data);
      }
    }).catch(function(error) {
      empty('No se encontraron resultados.');
      console.log(error);
    });
  } else {
    ajax('/api/all', 'POST', {}).then(function(data) {
      if (data.response.code === '1') {
        processPlaces(data.response.data);
      } else if (data.response.code === '0') {
        empty(data.response.data);
      }
    }).catch(function(error) {
      empty('No se encontraron resultados.');
      console.log(error);
    });
  }
});