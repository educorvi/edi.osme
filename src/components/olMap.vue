<template>
    <div id="olmap"></div>
</template>

<script>
    /* eslint-disable no-unused-vars */

    import 'ol/ol.css';
    import Feature from 'ol/Feature';
    import Map from 'ol/Map';
    import gaMap from ""
    import View from 'ol/View';
    import Point from 'ol/geom/Point';
    import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
    import {fromLonLat, transform} from 'ol/proj';
    import VectorSource from 'ol/source/Vector';
    import {Icon, Style, Fill, Stroke, Text, Circle} from 'ol/style';
    import OSM from "ol/source/OSM"

    export default {
        name: "map",

        data() {
            return {
                map: null
            }
        },

        mounted() {
            const map = new Map({
                target: 'olmap',
                layers: [
                    new TileLayer({
                        source: new OSM()
                    })
                ],
                view: new View({
                    center: [0,0],
                    zoom: 0
                })
            });

            this.map = map;

            const vectorSource = new VectorSource({
                features: []
            });

            const vectorLayer = new VectorLayer({
                source: vectorSource
            });

            map.addLayer(vectorLayer)

            function featureListener(event, feature) {
                function mapsSelector() {
                    const ua = navigator.userAgent.toLowerCase();
                    const isAndroid = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");
                    const lat = feature.get("lat");
                    const lon = feature.get("lon");
                    if /* if we're on iOS, open in Apple Maps */
                    ((navigator.platform.indexOf("iPhone") !== -1) ||
                        (navigator.platform.indexOf("iPad") !== -1) ||
                        (navigator.platform.indexOf("iPod") !== -1))
                        window.open(`http://maps.apple.com/maps?q=${lat},${lon}`);
                    else if (isAndroid) {
                        window.open(`geo:${lon},${lat}`);
                    } else {
                        window.open(`https://maps.google.com/maps?daddr=${lat},${lon}&amp;ll=`);
                    }

                }
                mapsSelector()


            }


            map.on('click', function(event) {
                map.forEachFeatureAtPixel(event.pixel, function(feature,layer) {
                    featureListener(event, feature);
                });
            });


            function styleFunction(feature, resolution) {
                return [
                    new Style({
                        image: new Circle({
                            radius: 8,
                            fill: new Fill({color: 'rgb(255,255,255)'}),
                            stroke: new Stroke({color: 'blue', width: 1})
                        }),
                        text: new Text({
                            font: '16px Calibri,sans-serif',
                            fill: new Fill({ color: '#000' }),
                            stroke: new Stroke({
                                color: '#fff', width: 2
                            }),
                            offsetY: 22,
                            // get the text from the feature - `this` is ol.Feature
                            // and show only under certain resolution
                            text: resolution > 100 ? "" : feature.get('title'),
                            backgroundFill: new Fill({color: 'rgba(255,255,255,0.64)'})
                        })
                    }),
                    new Style({

                        text: new Text({
                            font: '14px Calibri,sans-serif',
                            fill: new Fill({ color: '#000' }),
                            stroke: new Stroke({
                                color: '#fff', width: 2
                            }),
                            offsetY: 50,
                            // get the text from the feature - `this` is ol.Feature
                            // and show only under certain resolution
                            text: resolution > 100 ? "" : feature.get('adresse'),
                            backgroundFill: new Fill({color: 'rgba(255,255,255,0.64)'})
                        })
                    })
                ];
            }

            function addPoint(lon, lat, title, adresse) {
                const point = new Feature({
                    geometry: new Point(fromLonLat([lon, lat]))
                })

                point.set('title', title);
                point.set('adresse', adresse);
                point.set("lon", lon);
                point.set("lat", lat);
                point.setStyle(styleFunction)

                vectorSource.addFeature(point);
                return point;

            }


            const arbeit = addPoint(10.986680, 49.470240, "Niederlassung Fürth", "Karolinenstraße 17\n 90762 Fürth");
            addPoint(10.990280, 49.472500, "Süße Freiheit", "Friedrichstraße 5\n90762 Fürth");

            map.getView().fit(arbeit.getGeometry(), {maxZoom: 17});

            console.log(map.geocode("Feld-Am-See-Ring 11 91452 Wilhermsdorf"));
        }
    }
</script>

<style scoped>
    #olmap {
        width: 100%;
        height: 800px;
        max-height: 90vh;


    }
</style>
