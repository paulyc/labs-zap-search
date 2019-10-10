import { module, test } from 'qunit';
import {
  visit,
  currentURL,
  findAll,
} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { invalidateSession, authenticateSession } from 'ember-simple-auth/test-support';

// NOTE: This suite assumes user 1 is logged in.
module('Acceptance | my projects tabs filter', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function() {
    window.location.hash = '';

    await invalidateSession();
  });

  hooks.afterEach(async function() {
    window.location.hash = '';

    await invalidateSession();
  });

  hooks.beforeEach(async function() {
    await authenticateSession();

    // this.server.get('/projects', function (schema) {
    //   return schema.projects.all().slice(0, 2);
    // });
  });

  test('Upcoming tab displays only User upcoming projects', async function(assert) {
    this.server.createList('project', 5, { tab: 'upcoming' });

    await visit('/my-projects/upcoming');
    assert.equal(currentURL(), '/my-projects/upcoming');

    assert.equal(findAll('[data-test-project-card]').length, 5, 'Number of displayed projects is same as number of users Upcoming projects');
  });
});
