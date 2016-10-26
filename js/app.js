(function() {
        'use strict';

        const $search = $('#search');

        var movies = [];

        var renderMovies = function() {
            $('#listings').empty();

            for (var movie of movies) {
                var $col = $('<div class="col s6">');
                var $card = $('<div class="card hoverable">');
                var $content = $('<div class="card-content center">');
                var $title = $('<h6 class="card-title truncate">');

                $title.attr({
                    'data-position': 'top',
                    'data-tooltip': movie.title
                });

                $title.tooltip({
                    delay: 50,
                });
                $title.text(movie.title);

                var $poster = $('<img class="poster">');

                $poster.attr({
                    src: movie.poster,
                    alt: `${movie.poster} Poster`
                });

                $content.append($title, $poster);
                $card.append($content);

                var $action = $('<div class="card-action center">');
                var $plot = $('<a class="waves-effect waves-light btn modal-trigger">');

                $plot.attr('href', `#${movie.id}`);
                $plot.text('Plot Synopsis');

                $action.append($plot);
                $card.append($action);

                var $modal = $(`<div id="${movie.id}" class="modal">`);
                var $modalContent = $('<div class="modal-content">');
                var $modalHeader = $('<h4>').text(movie.title);
                var $movieYear = $('<h6>').text(`Released in ${movie.year}`);
                var $modalText = $('<p>').text(movie.plot);

                $modalContent.append($modalHeader, $movieYear, $modalText);
                $modal.append($modalContent);

                $col.append($card, $modal);

                $('#listings').append($col);

                $('.modal-trigger').leanModal();
            }
        };

        $(function() {

                function getPlot() {
                    console.log('getting plot');
                    const fields = {
                        'Plot': 'plot'
                    };
                    //load id info from localStorage OR API
                    console.log('plot retrieval underway');
                    var ajaxObject = JSON.parse(localStorage.getItem('ajax'));
                    var id = ajaxObject.imdbID;
                    var data = $.getJSON('http://www.omdbapi.com/?', ('i=' + id + '&plot=full&r=json'));
                    data.done(function(data) {
                            localStorage.setItem('ajaxID', JSON.stringify(data));
                            // $("a:contains('Plot Synopsis')").off('click');
                            Object.assign(movies[0], (translateJXHR(data, fields))); renderMovies();
                                return;
                            }); data.fail(function() {
                            return 'error getting ID for plot';
                        }); console.log('exiting getPlot');
                        return;
                    }

                    function translateJXHR(obj, searchVals) {
                        console.log('translating', obj);
                        var movie = {};
                        for (let i in searchVals) {
                            movie[searchVals[i]] = obj[i];
                        }

                        return movie;
                    }

                    function getMovies() {
                        const fields = {
                            'Poster': 'poster',
                            'Title': 'title',
                            'Year': 'year',
                            'imdbID': 'id'
                        };
                        //load info from API OR localStorage
                        var data = $.getJSON('http://www.omdbapi.com/?', ('t=' + $search.val()));

                        data.done(function(data) {
                          console.log(data);
                            localStorage.setItem('ajaxMovie', JSON.stringify(data));
                            movies = [translateJXHR(data, fields)];
                            //add click to card
                            // $("a:contains('Plot Synopsis')").click(getPlot);
                            renderMovies();
                            return;
                        });

                        data.fail(function() {
                            return console.log('sorry:', $search.val(), 'unusable');
                        });
                        return;
                    }

                    function searchSubmit(event) {
                        event.preventDefault();
                        console.log('you\'re searching', $search.val(), '!');
                        if ($search.val()) {
                            // localStorage.clear();
                            getMovies();
                            getPlot();
                        } else {
                            console.log('failure to search');
                        }
                        return;
                    }

                    $('form').submit(searchSubmit);

                    // $search.change(function() {});
                });

        })();
