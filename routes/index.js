var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

const ctrlInst = require('../app_api/controller/institution')
const ctrlAuth = require('../app_api/controller/auth')
const ctrlHeadTeacher = require('../app_api/controller/headteacher')
const ctrlClassConfig = require('../app_api/controller/classDetails')

const ctrlTeacher = require('../app_api/controller/teacher')
const ctrlLearner = require('../app_api/controller/learner')
const ctrlAttendance = require('../app_api/controller/attendance')


router.post('/institution', ctrlInst.add_institutions)
router.get('/institution_list', ctrlInst.institution_list)
router.get('/read_one_institution/:institutionId', ctrlInst.read_one_institution)
router.put('/update_institution/:institutionId', ctrlInst.update_institution)
router.get('/institution_based_admin_list', ctrlInst.institution_based_admin_list)

// Auth
router.post('/register', ctrlAuth.register_user)
router.post('/login', ctrlAuth.login)
router.get('/read_one_user_details/:userId', ctrlAuth.read_one_user_details)
router.put('/update_user/:personId', ctrlAuth.update_user)
router.put('/update_user_password/:userId', ctrlAuth.update_user_password)

//router.get('/')


//  head teacher section
router.get('/learners_list_by_institution_id/:institutionId', ctrlHeadTeacher.learners_list_by_institution_id)
router.get('/unassigned_class_learners_list_by_institution_id/:institutionId', ctrlHeadTeacher.unassigned_class_learners_list_by_institution_id)

router.get('/teachers_list_by_institution_id/:institutionId', ctrlHeadTeacher.teachers_list_by_institution_id)

router.get('/learners_by_gender_by_institution_id/:institutionId', ctrlHeadTeacher.learners_by_gender_by_institution_id)
router.get('/teachers_by_gender_by_institution_id/:institutionId', ctrlHeadTeacher.teachers_by_gender_by_institution_id)


// configuration section
router.post('/configure_classes', ctrlClassConfig.configure_classes)
router.post('/configure_subjects', ctrlClassConfig.configure_subjects)
router.get('/read_list_classes', ctrlClassConfig.read_list_classes)
router.get('/read_list_subjects', ctrlClassConfig.read_list_subjects)

router.post('/configure_class_subjects', ctrlClassConfig.configure_class_subjects)
router.get('/read_subjects_available_in_class/:classId', ctrlClassConfig.read_subjects_available_in_class)
router.put('/assign_student_class/:userId', ctrlClassConfig.assign_student_class)

router.post('/assign_class_to_teacher/:userId', ctrlClassConfig.assign_class_to_teacher)

//learner grades and subjects in class
router.get('/get_list_subjects_class_learner/:institutionId/:userId',ctrlLearner.get_list_subjects_class_learner)


//Teacher add grades and reports list
router.get('/read_subjects_classes_to_add_grades/:userId/:classId', ctrlTeacher.read_subjects_classes_to_add_grades)
router.post('/add_learner_subject_grade', ctrlTeacher.add_learner_subject_grade)

router.get('/read_student_deatils_with_grades/:institutionId', ctrlTeacher.read_student_deatils_with_grades)

router.post('/log_student_attendance', ctrlAttendance.log_student_attendance)
router.get('/attendance_list/:institutionId', ctrlAttendance.attendance_list)


module.exports = router;
