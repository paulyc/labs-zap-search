import Component from '@ember/component';
import { argument } from '@ember-decorators/argument';

export const projectCentroidsCircleLayer = {
  id: 'project-centroids-circle',
  type: 'circle',
  source: 'project-centroids',
  'source-layer': 'project-centroids',
  paint: {
    'circle-radius': {
      stops: [[10, 3], [15, 4]],
    },
    'circle-color': {
      property: 'dcp_publicstatus_simp',
      type: 'categorical',
      stops: [
        ['Filed', '#FF9400'],
        ['In Public Review', '#78D271'],
        ['Completed', '#44A3D5'],
      ],
      default: '#6b717b',
    },
    'circle-opacity': 1,
    'circle-stroke-width': { stops: [[10, 1], [15, 2]] },
    'circle-stroke-color': '#FFFFFF',
  },
};

export const projectCentroidsCircleHoverLayer = {
  id: 'project-centroids-circle-hover',
  type: 'circle',
  source: 'project-centroids',
  'source-layer': 'project-centroids',
  layout: { visibility: 'none' },
  paint: {
    'circle-radius': 5,
    'circle-color': '#ae561f',
    'circle-opacity': 1,
    'circle-stroke-width': { stops: [[10, 1], [15, 2]] },
    'circle-stroke-color': '#FFFFFF',
  },
};

export default class ProjectListMapComponent extends Component {
  @argument
  tiles = [];

  @argument
  bounds = [];

  // we thread it down so components - which are separate
  // from controller/query param context - may update QPs
  @argument
  appliedFilters;

  fitBoundsOptions = {
    padding: 20,
  }

  projectCentroidsCircleLayer = projectCentroidsCircleLayer;

  projectCentroidsCircleHoverLayer = projectCentroidsCircleHoverLayer;
}
