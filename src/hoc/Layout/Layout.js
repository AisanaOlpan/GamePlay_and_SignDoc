import { MainPage } from "../../containers/main/MainPage";
import classes from "..Layout/Layout.module.css";

function Layout() {
  return (
    <div className={classes.Layout}>
      <main>
        <MainPage></MainPage>
      </main>
    </div>
  );
}

export default Layout;
