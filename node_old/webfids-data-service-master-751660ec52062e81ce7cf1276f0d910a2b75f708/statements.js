/* Statement to get SELECT stmt used to get page template */
const pageTemplateSelectStmt =
  'SELECT page_description ' +
   ' FROM webfids_page_desc ' +
  ' WHERE key_page = :keyPage ' +
    ' AND system_id = 0 ' +
    ' AND site_id  = :siteId ';

const getPageData = 'BEGIN :resultset := pkg90_webfids.f90_get_page_data(:keyPage, :siteId); END;';

/* Statement to get page to be displayed on device */
const currentPageSelectStmt =
  'SELECT pages_to_display ' +
   ' FROM webfids_config ' +
  ' WHERE (ipv4_address = :ipAddress OR ipv6_address = :ipAddress ) ' +
    ' AND system_id = 0 ' +
    ' AND site_id = :siteId ';

const updatePageList = '' +
  'UPDATE webfids_config ' +
  'SET pages_to_display = :pageList ' +
  'WHERE (ipv4_address = :ipAddress OR ipv6_address = :ipAddress ) ' +
  'AND system_id = 0 ' +
  'AND site_id = :siteId ';

module.exports = {
  pageTemplateSelectStmt,
  getPageData,
  currentPageSelectStmt,
  updatePageList
};
