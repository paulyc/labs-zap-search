import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class MyProjectsReviewedRoute extends Route {
  @service
  currentUser;

  @service
  store;

  async model() {
    return this.store.query('assignment', {
      tab: 'reviewed',
      include: 'project.milestones,project.dispositions,project.actions,dispositions,dispositions.action',
    }, {
      reload: true,
    });
  }
}
