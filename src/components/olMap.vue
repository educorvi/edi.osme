<template>
    <div id="olmap"></div>
</template>

<script>
    /* eslint-disable no-unused-vars */

    import 'ol/ol.css';
    import Feature from 'ol/Feature';
    import Map from 'ol/Map';
    import View from 'ol/View';
    import Point from 'ol/geom/Point';
    import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
    import {fromLonLat, transform} from 'ol/proj';
    import VectorSource from 'ol/source/Vector';
    import {Icon, Style, Fill, Stroke, Text, Circle} from 'ol/style';
    import OSM from "ol/source/OSM"
    import FullScreen from "ol/control/FullScreen"
    import ScaleLine from 'ol/control/ScaleLine';

    import axios from "axios"


    export default {
        name: "olMap",

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
                    center: [0, 0],
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
            map.addControl(new FullScreen());
            map.addControl(new ScaleLine())

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


            map.on('click', function (event) {
                map.forEachFeatureAtPixel(event.pixel, function (feature, layer) {
                    featureListener(event, feature);
                });
            });

            const descVisible = 20;
            const colorPrimary = 'rgb(1,75,148)'


            function styleFunction(feature, resolution) {
                return [
                    new Style({
                        image: new Circle({
                            radius: 8,
                            fill: new Fill({color: colorPrimary}),
                            stroke: new Stroke({color: '#ffffff', width: 1})
                        }),
                        text: new Text({
                            font: '16px Calibri,sans-serif',
                            fill: new Fill({color: '#000'}),
                            stroke: new Stroke({
                                color: '#fff', width: 2
                            }),
                            offsetY: 22,
                            // get the text from the feature - `this` is ol.Feature
                            // and show only under certain resolution
                            text: resolution > descVisible ? "" : feature.get('title'),
                            backgroundFill: new Fill({color: 'rgba(255,255,255,0.64)'})
                        })
                    }),
                    new Style({

                        text: new Text({
                            font: '14px Calibri,sans-serif',
                            fill: new Fill({color: '#000'}),
                            stroke: new Stroke({
                                color: '#fff', width: 2
                            }),
                            offsetY: 50,
                            // get the text from the feature - `this` is ol.Feature
                            // and show only under certain resolution
                            text: resolution > descVisible ? "" : feature.get('address'),
                            backgroundFill: new Fill({color: 'rgba(255,255,255,0.64)'}),
                        })
                    })
                ];
            }

            function addPoint(lon, lat, title, address) {
                const point = new Feature({
                    geometry: new Point(fromLonLat([lon, lat]))
                })

                point.set('title', title);
                point.set('address', address);
                point.set("lon", lon);
                point.set("lat", lat);
                point.setStyle(styleFunction)

                vectorSource.addFeature(point);
                return point;

            }

            // noinspection JSMismatchedCollectionQueryUpdate
            const points = [];

            axios.get("locations.json").then(res => {
                for (let i = 0; i < res.data.length; i++) {
                    let loc = res.data[i];
                    points.push(addPoint(loc.lon, loc.lat, loc.title, loc.address));
                }
                afterFilled()
            });


            function afterFilled() {
                const extent = vectorLayer.getSource().getExtent();
                map.getView().fit(extent);
                map.getView().setZoom(map.getView().getZoom() - 1)
                map.updateSize();
            }

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
