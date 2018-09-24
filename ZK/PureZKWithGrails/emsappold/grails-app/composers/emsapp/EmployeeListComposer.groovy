package emsapp

import org.zkoss.zkgrails.*
import org.zkoss.zkplus.databind.BindingListModelList
import org.zkoss.zk.ui.event.Event
import org.zkoss.zk.ui.event.Events

class EmployeeListComposer extends GrailsComposer {

    def employees
    def employeeListbox
    def search

    def afterCompose = { window ->
        employees = new BindingListModelList(Employee.list(),true)
    }

    void onClick_delete(Event event) {
        def selEmployee = employeeListbox.selectedItem?.value
        employees.remove(selEmployee)
        selEmployee.delete(failOnError: true, flush:true)
        Events.postEvent(new Event("onLoadPage",event.target.root, "./employeeList.zul"))
    }

    void onClick_edit(Event event) {
        def selEmployee = employeeListbox.selectedItem?.value
        execution.setAttribute("empid",selEmployee.id)
        Events.postEvent(new Event("onLoadPage",event.target.root, "./employeeMaint.zul"))
    }

    void onClick_searchbtn(Event event) {
        String text = "%" + search.value?.toLowerCase() + "%"
        String hql = "from Employee where lower(firstName) like :search or lower(lastName) like :search"
        def list = Employee.findAll(hql,[search:text])
        employees.clear()
        employees.addAll(list)
    }
}


