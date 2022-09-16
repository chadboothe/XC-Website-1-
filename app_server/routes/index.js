var express = require('express');
var router = express.Router();
var ctrlHome = require('../controllers/home');
var ctrlMeet = require('../controllers/meet_info');
var ctrlPlanning = require('../controllers/planning_sheets');
var ctrlRaces = require('../controllers/race_results');
var ctrlPlans = require('../controllers/training_plans');
var ctrlUpload = require('../controllers/upload_results');
var ctrlCourse = require('../controllers/addCourse');


/* HOME page. */
router.get('/', ctrlHome.home);

/* Meet Info page. */
router.get('/meet_info', ctrlMeet.meet);

/* Planning Sheet page. */
router.get('/planning_sheets', ctrlPlanning.planning);

/* Race Results page. */
router.get('/race_results', ctrlRaces.races);
router.post('/search', ctrlRaces.races);

/* Training Plans */
router.get('/training_plans', ctrlPlans.plans);

/* Upload */
router.get('/upload_results', ctrlUpload.upload);
router.post('/upload_post', ctrlUpload.upload_post);
router.post('/athleticnet_post', ctrlUpload.athleticnet_post);

//Personel Record (PR)
router.post('/pr_post', ctrlUpload.prUpdate);

/* Add a course to the database */
router.get('/addCourse', ctrlUpload.upload_post);
router.post('/addCourse', ctrlCourse.addCourse);

module.exports = router;
