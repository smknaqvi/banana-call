import { AppBar } from "@material-ui/core";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import { HOME_INDEX, TEACHER_INDEX, STUDENT_INDEX } from "../../../constants";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function Navbar({ pageIndex, handleChange }) {
  return (
    <AppBar position="static">
      <Tabs value={pageIndex} onChange={handleChange}>
        <Tab label="Home" {...a11yProps(HOME_INDEX)} />
        <Tab label="Teacher" {...a11yProps(TEACHER_INDEX)} />
        <Tab label="Student" {...a11yProps(STUDENT_INDEX)} />
      </Tabs>
    </AppBar>
  );
}

export default Navbar;
