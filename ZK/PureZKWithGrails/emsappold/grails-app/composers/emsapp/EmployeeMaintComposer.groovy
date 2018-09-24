package emsapp

import org.zkoss.zkgrails.*
import org.zkoss.zk.ui.event.Event
import org.zkoss.zul.Messagebox
import org.zkoss.zk.ui.event.Events

class EmployeeMaintComposer extends GrailsComposer {

    def employee

    def afterCompose = { window ->
        if(execution.hasAttribute("empid")) {
            employee = Employee.get(execution.getAttribute("empid"))
        }else {
            employee = new Employee()
            employee.active = false
        }
    }

    void onClick_save(Event event) {
        employee.save(failOnError: true, flush:true)
        //Messagebox.show("Save Successfull..")
        Events.postEvent(new Event("onLoadPage",event.target.root, "./employeeList.zul"))
    }
}
