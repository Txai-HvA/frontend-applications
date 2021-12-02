import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import '../../css/TopArtists.css';
import ColorHash from 'color-hash';

export const TopArtists = ({ apiKey, userName, limit, period, genre }) => {
    const [topArtistsData, updateTopArtists] = useState({});
    const [topGenreArtistsData, updateGenreTopArtists] = useState({});
    const [singleArtistData, updateSingleArtist] = useState({});
    let colorHash = new ColorHash();
    let topArtists = [];
    let sameArtists = [];

    useEffect(() => {
        //Gets top user artists with the given username, limit, period and apiKey
        if (userName !== undefined) {
            fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getTopArtists&user=${userName}&api_key=${apiKey}
            &limit=${limit}&period=${period}&nowplaying=true&format=json`)
                .then((response) => {
                    if (response.ok) {
                        //Checks whether the HTTP response is okay
                        return response.json(); //Extract the JSON from the response
                    }
                    throw new Error('error');
                })
                .then((data) => updateTopArtists(data))
                .catch(() =>
                    updateTopArtists({
                        error: 'Whoops! Something went wrong with Last.fm',
                    })
                );
        }
        //Gets top artists from a specific genre with the given genre, limit and apiKey
        if (genre !== undefined) {
            fetch(`https://ws.audioscrobbler.com/2.0/?method=tag.getTopArtists&tag=${genre}&api_key=${apiKey}
            &limit=${limit}&format=json`)
                .then((response) => {
                    if (response.ok) {
                        //Checks whether the HTTP response is okay
                        return response.json(); //Extract the JSON from the response
                    }
                    throw new Error('error');
                })
                .then((data) => {
                    updateGenreTopArtists(data?.topartists?.artist);
                })
                .catch(() =>
                    updateTopArtists({
                        error: 'Whoops! Something went wrong with Last.fm',
                    })
                );
        }
    }, [apiKey, userName, limit, period, genre]);

    //Gets a single artist data
    const getSingleArtist = (artist) => {
        fetch(
            `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${artist}&api_key=${apiKey}&format=json`
        )
            .then((response) => {
                if (response.ok) {
                    //Checks whether the HTTP response is okay
                    return response.json(); //Extract the JSON from the response
                }
                throw new Error('error');
            })
            .then((data) => {
                updateSingleArtist(data);
            })
            .catch(() =>
                updateSingleArtist({
                    error: 'Whoops! Something went wrong with Last.fm',
                })
            );
    };

    //Creates a pie chart
    const createPieChart = () => {
        //Creates the pie chart
        const createGraph = (topArtists) => {
            let width = 500;
            let height = 500;
            //The radius of the pieplot is half the width or half the height (smallest one)
            let outerRadius = Math.min(width, height) / 2;

            //Removes the old svg
            d3.select('#userArtistPieChart').select('svg').remove();

            //Creates new svg
            const svg = d3
                .select('#userArtistPieChart')
                .append('svg')
                .attr('width', width)
                .attr('height', height)
                .append('g')
                .attr('transform', `translate(${width / 2}, ${height / 2})`);

            //Creates the circle
            //where .innerRadius() is the hole in the middle
            //and where .outerRadius() is the actual radius of the circle
            const arcGenerator = d3
                .arc()
                .innerRadius(90)
                .outerRadius(outerRadius);

            const pieGenerator = d3
                .pie()
                .padAngle(0)
                .value((d) => d.value);

            const userArtistPieChartSVG = svg
                .selectAll()
                .data(pieGenerator(topArtists))
                .enter();

            //Append arcs
            userArtistPieChartSVG
                .append('path')
                .style('fill', (d, i) => colorHash.hex(d.data.artistName))
                .transition()
                .delay((d, i) => i * 500)
                .attr('d', arcGenerator);

            //Append text labels
            userArtistPieChartSVG
                .append('text')
                .transition()
                .delay((d, i) => i * 500)
                .attr('text-anchor', 'middle')
                .attr('alignment-baseline', 'middle')
                .text((d) => d.data.value)
                .style('fill', (d, i) => {
                    let artistColor = colorHash.hex(d.data.artistName);
                    artistColor = invertColor(artistColor);
                    return artistColor;
                })
                .attr(
                    'transform',
                    (d) => `translate(${arcGenerator.centroid(d)})`
                ); //used to compute the midpoint of the centerline of the arc
        };

        //Inverts the color of the given hex
        const invertColor = (hex) => {
            if (hex.indexOf('#') === 0) {
                hex = hex.slice(1);
            }
            // convert 3-digit hex to 6-digits.
            if (hex.length === 3) {
                hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
            }
            // invert color components
            let r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
                g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
                b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
            // pad each with zeros and return
            return '#' + padZero(r) + padZero(g) + padZero(b);
        };

        //Adds 0's if needed
        const padZero = (str, len) => {
            len = len || 2;
            let zeros = new Array(len).join('0');
            return (zeros + str).slice(-len);
        };
        //Source https://stackoverflow.com/questions/35969656/how-can-i-generate-the-opposite-color-according-to-current-color

        if (topArtists.length > 0) {
            //Wait 1 second till the graph can generate
            setTimeout(function () {
                createGraph(topArtists);
            }, 1000);
        }
    };

    //Gets the data value thats going to be used
    const filterData = () => {
        const { error } = topArtistsData;

        if (error) {
            return <p>{error}</p>;
        } else {
            if (!topArtistsData?.topartists?.artist) {
                return <h2>Loading artists data... ⏳</h2>;
            }
            topArtistsData?.topartists?.artist.forEach((d) => {
                topArtists.push({
                    artistName: d.name,
                    value: d.playcount,
                    url: d.url,
                    image: d.image[2]['#text'],
                });
            });
        }
    };

    //Compares the top artist from a user with top artists from a genre
    const compareTopArtists = () => {
        if (topGenreArtistsData.length > 0) {
            topGenreArtistsData.forEach((topGenreArtist) => {
                topArtists.forEach((topArtist) => {
                    if (topGenreArtist.name === topArtist.artistName) {
                        sameArtists.push(topArtist.artistName);
                    }
                });
            });
        }
    };

    const artistInfo = d3.select('#artistInfo');
    //Gets the bio summary of a specific artist
    const getArtistInfo = (artistName) => {
        getSingleArtist(artistName);
        artistInfo.style('visibility', 'visible');
        artistInfo.select('p').html(singleArtistData?.artist?.bio?.summary);
    };

    //Hides the bio summary of a specific artist
    const hideArtistInfo = () => {
        artistInfo.style('visibility', 'hidden');
    };

    const createComponent = () => {
        filterData();
        createPieChart();
        compareTopArtists();

        return (
            <div id="userArtistContainer">
                <div>
                    <h3>Top Artists 🎙️</h3>
                    <div id="userArtistPieChart" />
                </div>
                <div id="userArtistLegend">
                    <ul>
                        {topArtists.map((d, i) => {
                            return (
                                <li>
                                    <button
                                        onClick={() =>
                                            getArtistInfo(d.artistName)
                                        }
                                    >
                                        <span
                                            style={{
                                                color: 'transparent',
                                                textShadow: `0 0 0 ${colorHash.hex(
                                                    d.artistName
                                                )}`,
                                            }}
                                        >
                                            🎙️
                                        </span>{' '}
                                        #{i + 1} {d.artistName}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                    <label>
                        {userName}'s top {limit} artists that are also the top{' '}
                        {limit} artists of {genre}:
                    </label>
                    <ul>
                        {sameArtists.map((d, i) => {
                            return <li>{d}</li>;
                        })}
                    </ul>
                </div>
                <div id="artistInfo">
                    <button onClick={() => hideArtistInfo()}>X</button>
                    <p></p>
                </div>
            </div>
        );
    };

    return createComponent();
};
