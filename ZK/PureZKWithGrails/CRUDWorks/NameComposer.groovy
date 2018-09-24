package zktraining

import org.zkoss.zkgrails.*
import org.zkoss.zkplus.databind.BindingListModelList
import org.zkoss.zk.ui.event.Event

class NameComposer extends GrailsComposer {

    // <listbox id="mylistbox" model="@{mywin$composer.listNames}" mold="paging" pageSize="20">
	// model type = <T> ListModel<T> according to java api
	
    def listNames  // <T>ListModel<T> : An interface
	                 // Implemented by BindingListModelList
					  
    def mybutton2
	def mylistbox

    def afterCompose = { window ->

        listNames = new BindingListModelList(Name.list(), true)
    }

    void onClick_mybutton2(Event event) {

        listNames << new Name()
    }

    void onClick_save(Event event) {

       listNames?.each { name ->

            name.save(flush:true)
       }

       listNames?.clear()
       listNames.addAll(Name.list())
	   

    }

    void onClick_delete(Event event) {
	    
	  def selectedName = mylistbox.selectedItem?.value  // type = Listitem
	  alert("domain = " + selectedName)  // selected name = <Listitem a3AQf> ie non null
	  listNames.remove( selectedName )  // removed from BindingListModelList - why still visible on screen?
	  selectedName.delete()
      	  
	  // attempting to delete actual data

	  
	  
	}
}

