package amrit

import org.zkoss.zkgrails.*
import org.zkoss.zkplus.databind.BindingListModelList

class CourseDetailInformationComposer extends GrailsComposer {

    // UI elements
    def courseFeesListbox
    def subject
    def course
    def term
    def go
    def del

    // models
    def courseFeesModel

    def afterCompose = { window ->

        // create and populate the model
        //courseFeesModel = new BindingListModelList( CourseFee.list(), true )
        courseFeesModel = new BindingListModelList( [], true )
        //courseFeesModel = new BindingListModelList( CourseFee.list(), true )

        //courseFeesListbox.setVisible(false)
    }

    void onClick_go() {
       

        // def courseCatalog = CourseCatalog.findBySubjectAndCourseNumber( Subject.findByCode(subject.value), course.value)
        // courseFeesModel.addAll( CourseFee.findAllByCourseCatalog( courseCatalog ) )
        
        
        if (go.getLabel() == "GO") {

            courseFeesModel.clear()

            courseFeesModel.addAll( CourseFee.fetchBySubjectCourseNumberAndTermEffective( subject.value,
                    course.value,
                    term.value) )

            go.setLabel("Start Over")
            subject.setDisabled(true)
            course.setDisabled(true)
            term.setDisabled(true)

        } else {

            courseFeesModel.clear()
            go.setLabel("GO")
            subject.setDisabled(false)
            course.setDisabled(false)
            term.setDisabled(false)
        }

    }

    void onClick_del() {

        def selectedItem = courseFeesListbox.selectedItem?.value
        courseFeesModel.remove( selectedItem )
        del.setDisabled(true)
    }

    void onClick_load() {
        courseFeesModel.clear()
        courseFeesModel.addAll( CourseFee.list() )
    }

    void onClick_clear() {
        courseFeesModel.clear()
    }

    void onClick_save() {
        courseFeesModel.each { fee -> fee.save(flush:true) }
    }
}
