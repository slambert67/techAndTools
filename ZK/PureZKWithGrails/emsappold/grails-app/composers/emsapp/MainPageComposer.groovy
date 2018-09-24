package emsapp

import org.zkoss.zkgrails.*
import org.zkoss.zk.ui.event.Event

class MainPageComposer extends GrailsComposer {

    def content

    def afterCompose = { window ->
        // initialize components here
    }

    void onClick_addnewemployeemenu(Event event) {
        loadPage("./employeeMaint.zul")
    }

    void onLoadPage(Event event) {
        loadPage(event.data)
    }

    private void loadPage(page) {
        content.children?.clear()
        execution.createComponents(page,content,null)
    }

    void onClick_employeelistmenu(Event event) {
        loadPage("./employeeList.zul")
    }
}
