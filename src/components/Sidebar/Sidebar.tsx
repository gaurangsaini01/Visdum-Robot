import { NavLink, useNavigate } from "react-router-dom";
import { sideBarOptions } from "../../data";
import "./Sidebar.css";
import { logout } from "../../services/operations/auth";
import { useDispatch, useSelector } from "react-redux";
import { getInitials } from "../../utils/getInitial";
import { useState } from "react";
import { MdNavigateNext } from "react-icons/md";
import { MdNavigateBefore } from "react-icons/md";
import ConfirmationModal from "../Reusable/ConfirmationModal";

const Sidebar = () => {
  const [show, setShow] = useState(false)
  const { user } = useSelector((state: any) => state.auth)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loggingOut, setLoggingOut] = useState(false)
  const [collapsed, setCollapsed] = useState(false);
  const handleLogout = async (navigate, dispatch) => {
    setLoggingOut(true)
    await logout(navigate, dispatch)
    setLoggingOut(false)
  };

  return (
    <div className={`sidebar-container d-flex flex-column justify-content-between p-3${collapsed ? ' collapsed' : ''}`}
      style={{ transition: 'width 0.3s cubic-bezier(.4,2,.6,1)', width: collapsed ? 64 : 240 }}>
      <div>
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h5 className="sidebar-logo mb-0 d-flex align-items-center" style={{ transition: 'opacity 0.2s' }}>
            {!collapsed && <span className="text-primary">●</span>}
            {!collapsed && <span className="ms-2 fw-bolder">Visdum Watch</span>}
          </h5>
          <button
            className="sidebar-toggle-btn"
            style={{ width: 32, height: 32, borderRadius: '50%', transition: 'transform 0.2s', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => setCollapsed((prev) => !prev)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <MdNavigateNext size={20} /> : <MdNavigateBefore size={20} />}
          </button>
        </div>

        {sideBarOptions
          ?.filter(option => option.roles.includes(user?.role_id))
          .map((option) => {
            const Icon = option.icon;
            return (
              <NavLink
                key={option?.name}
                to={option?.name}
                className={({ isActive }) =>
                  `sidebar-link d-flex align-items-center gap-2 p-2 mb-2${collapsed ? ' sidebar-link-collapsed' : ''} ${isActive ? "active" : ""}`
                }
                style={{ justifyContent: collapsed ? 'center' : 'flex-start', transition: 'all 0.2s' }}
              >
                <Icon className="sidebar-icon" style={{ fontSize: 22 }} />
                {!collapsed && <span>{option?.value}</span>}
              </NavLink>
            );
          })}
      </div>

      <div className={`sidebar-footer text-center mt-auto${collapsed ? ' sidebar-footer-collapsed' : ''}`} style={{ transition: 'all 0.2s' }}>
        <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
          <div className="avatar-circle">{getInitials(user)}</div>
          {!collapsed && <span className="text-dark fw-semibold">{user?.name || "User"}</span>}
        </div>
        <button
          onClick={() => setShow(true)}
          className="btn btn-outline-primary w-100"
          style={collapsed ? { display: "none" } : {}}
          title="Logout"
        >
          Logout
        </button>
      </div>
      <ConfirmationModal show={show} title={"Logout ?"} desc="Are you sure ? All unsaved progress will be lost." onClose={() => setShow(false)} onSubmit={() => handleLogout(navigate, dispatch)} closeText="Cancel" submitText={"Logout"} disableState={loggingOut} />
    </div>
  );
};

export default Sidebar;
