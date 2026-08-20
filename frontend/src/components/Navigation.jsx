import { NavLink } from "react-router-dom";

function Navigation() {
  return (
    <nav aria-label="Main navigation">
      <NavLink className="nav-link" to="/">
        Home
      </NavLink>
      <NavLink className="nav-link" to="/books">
        Books
      </NavLink>
      <NavLink className="nav-link" to="/borrow">
        Borrow
      </NavLink>
    </nav>
  );
}

export default Navigation;
