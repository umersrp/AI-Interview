import React, { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Icon from "@/components/ui/Icon";
import { toggleActiveChat } from "@/pages/app/chat/store";
import { useDispatch } from "react-redux";
import useMobileMenu from "@/hooks/useMobileMenu";

const Navmenu = ({ menus }) => {
  const location = useLocation();
  const [mobileMenu, setMobileMenu] = useMobileMenu();
  const dispatch = useDispatch();

  useEffect(() => {
    // Keep document title in sync with current pathname
    const titlePath = location.pathname.replace(/^\//, "");
    document.title = `Dashcode | ${titlePath}`;
    dispatch(toggleActiveChat(false));

    if (mobileMenu) {
      setMobileMenu(false);
    }
  }, [location]);

  // normalize helper for robust matching
  const normalize = (p = "") => p.replace(/\/+/g, "/").replace(/\/$/, "");
  const currentPath = normalize(location.pathname);

  return (
    <>
      <ul>
        {menus.map((item, i) => {
          const itemPath = normalize(item.link.startsWith("/") ? item.link : `/${item.link}`);
          const isActive =
            currentPath === itemPath || currentPath.startsWith(itemPath + "/");

          return (
            <li
              key={i}
              className={`single-sidebar-menu ${isActive ? "menu-item-active" : ""}`}
            >
              {/* Direct navigation for all menu items */}
              <NavLink
                className={`menu-link ${isActive ? "menu-link-active" : ""}`}
                to={itemPath}
                aria-current={isActive ? "page" : undefined}
                onClick={() => {
                  if (mobileMenu) {
                    setMobileMenu(false);
                  }
                }}
              >
                <span className="menu-icon flex-grow-0">
                  <Icon icon={item.icon} />
                </span>
                <div className="text-box flex-grow">{item.title}</div>
                {item.badge && <span className="menu-badge">{item.badge}</span>}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default Navmenu;