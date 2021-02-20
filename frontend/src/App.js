import { useState } from "react";
import { HOME_INDEX, STUDENT_INDEX, TEACHER_INDEX } from "./constants";
import Navbar from "./features/nav/components/NavbarComponent";
import HomePage from "./pages/HomePage";
import StudentPage from "./pages/StudentPage";
import TeacherPage from "./pages/TeacherPage";

function Page({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{ padding: "10px", margin: "5px" }}
    >
      {value === index && children}
    </div>
  );
}

function App() {
  const [pageIndex, setPageIndex] = useState(HOME_INDEX);

  const handleChange = (e, pageIndex) => setPageIndex(pageIndex);

  return (
    <div className="App">
      <Navbar handleChange={handleChange} pageIndex={pageIndex} />
      <Page value={pageIndex} index={HOME_INDEX}>
        <HomePage />
      </Page>
      <Page value={pageIndex} index={STUDENT_INDEX}>
        <StudentPage />
      </Page>
      <Page value={pageIndex} index={TEACHER_INDEX}>
        <TeacherPage />
      </Page>
    </div>
  );
}

export default App;
