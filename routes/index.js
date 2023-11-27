var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

const ctrlInst = require('../app_api/controller/institution')
const ctrlAuth = require('../app_api/controller/auth')
const ctrlHeadTeacher = require('../app_api/controller/headteacher')


router.post('/institution', ctrlInst.add_institutions)
router.get('/institution_list', ctrlInst.institution_list)
router.get('/read_one_institution/:institutionId', ctrlInst.read_one_institution)
router.put('/update_institution/:institutionId', ctrlInst.update_institution)
router.get('/institution_based_admin_list', ctrlInst.institution_based_admin_list)

// Auth
router.post('/register', ctrlAuth.register_user)
router.post('/login', ctrlAuth.login)
router.get('/read_one_user_details/:userId', ctrlAuth.read_one_user_details)
router.put('/update_user/:userId', ctrlAuth.update_user)
router.put('/update_user_password/:personId', ctrlAuth.update_user_password)

//router.get('/')


//  head teacher section
router.get('/learners_list_by_institution_id/:institutionId', ctrlHeadTeacher.learners_list_by_institution_id)
router.get('/teachers_list_by_institution_id/:institutionId', ctrlHeadTeacher.teachers_list_by_institution_id)
router.get('/all_learners_by_institution_id/:institutionId', ctrlHeadTeacher.all_learners_by_institution_id)
router.get('/learners_by_gender_by_institution_id/:institutionId', ctrlHeadTeacher.learners_by_gender_by_institution_id)
router.get('/all_teachers_by_institution_id/:institutionId', ctrlHeadTeacher.all_teachers_by_institution_id)
router.get('/teachers_by_gender_by_institution_id/:institutionId', ctrlHeadTeacher.teachers_by_gender_by_institution_id)

module.exports = router;
