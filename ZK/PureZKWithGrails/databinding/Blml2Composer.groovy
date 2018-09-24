package databinding

import org.zkoss.zkgrails.*
import org.zkoss.zkplus.databind.BindingListModelList
import org.zkoss.zk.ui.event.Event

class Blml2Composer extends GrailsComposer {

    def binder

    // UI elements
    def myListbox
    def myListbox2

    // Models
    def myListboxModel

    def afterCompose = { window ->

        // create and populate the model
        //myListboxModel = new BindingListModelList( Name.list(), true )

        // test data retrieval after page compose
        myListboxModel = new BindingListModelList( [], true )
    }

    // add new entry
    void onClick_add(Event event) {

        // instantiate new class instance and append to model
        // new blank instance visible in UI
        myListboxModel << new Name()
    }

    void onClick_add2(Event event) {
        def newEntry = new Name()
        newEntry.firstName = "XXX"
        newEntry.lastName = "YYY"

        myListboxModel << newEntry
    }

    // display data in model
    void onClick_show(Event event) {

        // shows that changes in UI successfully persisted to model
        myListboxModel.each { alert(it.firstName + ' ' + it.lastName) }
    }

    // persist data to database
    void onClick_save(Event event) {

        myListboxModel.each { name -> name.save(flush:true) }

        /*listNames?.clear()
        listNames.addAll(Name.list())  */
    }

    // update model directly - WHY ARE THESE CHANGES NOT VISIBLE IN UI?
    // CONTENT OF MODEL ELEMENTS AS OPPOSED TO MODEL ITSELF ???
    void onClick_update1(Event event) {
        /* myListboxModel.each { it.lastName = "updated"}
binder.loadAll()     // changes in UI only visible if this called
// can some UI annotations allow us to dispense with this?  */

        def entry = myListboxModel.get(0)
        entry.lastName = "updated"
        myListboxModel.set(0,entry)
    }

    // retrieve data after page is composed
    // HOW IS THIS DIFFERENT TO DIRECT ASSIGNMENT ABOVE ???
    void onClick_load(Event event) {
        // changes visible in UI without calling binder.loadAll() ???
        myListboxModel.clear()
        myListboxModel.addAll(Name.list())
    }

    // delete selected entry
    void onClick_delete(Event event) {

        // selection not being registered
        //def selectedEntry = myListbox.getSelectedItem?.getValue().firstName
        def selectedIndex = myListbox.getSelectedIndex()
        def selectedItem = myListbox.selectedItem?.value
        selectedItem.delete()  // delete from database

        myListboxModel.remove( selectedItem )
        // removed from model and reflected in UI
    }
}
