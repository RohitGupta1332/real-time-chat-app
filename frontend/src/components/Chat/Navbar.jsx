import { FiMessageSquare } from "react-icons/fi";
import { PiSparkleThin } from "react-icons/pi";
import { FaUsers } from "react-icons/fa";
import { FaUserFriends } from "react-icons/fa";
import styles from "../../styles/navbar.module.css";

const BottomNavbar = ({ activeTab, setActiveTab, isShrunk }) => {
  return (
    <div className={`${styles.navbar} ${isShrunk ? styles.shrunk : ""}`}>
      <div
        className={`${styles.navItem} ${activeTab === "chats" ? styles.active : ""}`}
        onClick={() => setActiveTab("chats")}
      >
        <FiMessageSquare />
        <span>Chats</span>
      </div>
      <div
        className={`${styles.navItem} ${activeTab === "ai" ? styles.active : ""}`}
        onClick={() => setActiveTab("ai")}
      >
        <PiSparkleThin />
        <span>Ai bot</span>
      </div>
      <div
        className={`${styles.navItem} ${activeTab === "groups" ? styles.active : ""}`}
        onClick={() => setActiveTab("groups")}
      >
        <FaUsers />
        <span>Groups</span>
      </div>
    </div>
  );
};

export default BottomNavbar;