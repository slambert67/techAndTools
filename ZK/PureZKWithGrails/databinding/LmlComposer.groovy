package databinding

import org.zkoss.zkgrails.*
import org.zkoss.zk.ui.event.Event
import org.zkoss.zul.ListModelList

class LmlComposer extends GrailsComposer {

    def binder

    // UI elements
    def myListbox

    // Models
    def myListboxModel

    def afterCompose = { window ->

        // create and populate the model
        //myListboxModel = new BindingListModelList( Name.list(), true )

        // test data retrieval after page compose
        myListboxModel = new ListModelList( [] )
    }

    // add new entry
    void onClick_add(Event event) {

        // instantiate new class instance and append to model
        // new blank instance visible in UI
        myListboxModel << new Name()
        binder.loadComponent(myListbox)
    }

    void onClick_add2(Event event) {
        def newEntry = new Name()
        newEntry.firstName = "XXX"
        newEntry.lastName = "YYY"

        myListboxModel << newEntry
        binder.loadComponent(myListbox)
    }

    // display data in model
    void onClick_show(Event event) {

        // shows that changes in UI successfully persisted to model
        myListboxModel.each { alert(it.firstName + ' ' + it.lastName) }
    }

    // persist data to database
    void onClick_save(Event event) {

        myListboxModel.each { name -> name.save(flush:true) }
        binder.loadComponent( myListbox )

    }

    void onClick_update1(Event event) {

        def entry = myListboxModel.get(0)
        entry.lastName = "updated"
        myListboxModel.set(0,entry)
        binder.loadComponent(myListbox)
    }

    void onClick_load(Event event) {

        myListboxModel.clear()
        myListboxModel.addAll(Name.list())
        binder.loadComponent( myListbox )
    }

    // delete selected entry
    void onClick_delete(Event event) {

        def selectedIndex = myListbox.getSelectedIndex()
        def selectedItem = myListbox.selectedItem?.value
        selectedItem.delete()

        myListboxModel.remove( selectedItem )
        binder.loadComponent(myListbox)
    }

}
