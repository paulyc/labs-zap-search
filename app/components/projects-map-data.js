import Component from '@ember/component';
import mapboxgl from 'mapbox-gl';
import { action } from '@ember-decorators/object';
import { argument } from '@ember-decorators/argument';
import { service } from '@ember-decorators/service';

export const geocodedLayer = {
  type: 'circle',
  paint: {
    'circle-radius': {
      stops: [
        [
          10,
          5,
        ],
        [
          17,
          12,
        ],
      ],
    },
    'circle-color': 'rgba(199, 92, 92, 1)',
    'circle-stroke-width': {
      stops: [
        [
          10,
          20,
        ],
        [
          17,
          18,
        ],
      ],
    },
    'circle-stroke-color': 'rgba(65, 73, 255, 1)',
    'circle-opacity': 0,
    'circle-stroke-opacity': 0.2,
  },
};

export default class ProjectsMapComponent extends Component {
  @service router;

  @service resultMapEvents;

  // required
  @argument meta = {};

  // hack: directly mutate applied filters
  @argument appliedFilters;

  tooltipPoint = { x: 0, y: 0 }

  highlightedFeature = null;

  geocodedFeature = null;

  geocodedLayer = geocodedLayer;

  popup = new mapboxgl.Popup({
    closeOnClick: false,
  });

  @argument onMapClick = () => {};

  @action
  handleMapLoad(map) {
    window.map = map;
    this.set('mapInstance', map);

    const navigationControl = new mapboxgl.NavigationControl();
    map.addControl(navigationControl, 'top-left');

    const geoLocateControl = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    });
    map.addControl(geoLocateControl, 'top-left');

    this.resultMapEvents.on('hover', this, 'hoverPoint');
    this.resultMapEvents.on('unhover', this, 'unHoverPoint');
    this.resultMapEvents.on('click', this, 'clickPoint');
  }

  @action
  handleMouseMove(e) {
    const map = this.mapInstance;
    const [feature] = map.queryRenderedFeatures(
      e.point,
      { layers: ['project-centroids-circle'] },
    );

    if (feature) {
      this.set('highlightedFeature', feature);

      this.set('tooltipPoint', {
        x: e.point.x + 20,
        y: e.point.y + 20,
      });

      map.getCanvas().style.cursor = 'pointer';
    } else {
      this.set('highlightedFeature', null);

      map.getCanvas().style.cursor = 'default';
    }
  }

  @action
  handleMapClick(e) {
    const map = this.mapInstance;
    const [feature] = map.queryRenderedFeatures(
      e.point,
      { layers: ['project-centroids-circle'] },
    );

    this.onMapClick(feature, e);
  }

  @action
  selectSearchResult({ geometry }) {
    const { coordinates } = geometry;
    const { mapInstance: map } = this;

    this.set('geocodedFeature', { type: 'geojson', data: geometry });
    map.flyTo({ center: coordinates, zoom: 16 });
  }

  hoverPoint({ id, layerId }) {
    this.mapInstance
      .setLayoutProperty(layerId, 'visibility', 'visible')
      .setPaintProperty('project-centroids-circle', 'circle-blur', 0.9)
      .setFilter(layerId, ['==', ['get', 'projectid'], id]);
  }

  unHoverPoint({ layerId }) {
    this.mapInstance
      .setPaintProperty('project-centroids-circle', 'circle-blur', 0)
      .setLayoutProperty(layerId, 'visibility', 'none');
  }

  clickPoint({ project }) {
    const { mapInstance: map } = this;
    const { center } = project;

    map.flyTo({ center, zoom: 15 });
  }

  willDestroyElement() {
    this.resultMapEvents.off('hover', this, 'hoverPoint');
    this.resultMapEvents.off('unhover', this, 'unHoverPoint');
  }
}
