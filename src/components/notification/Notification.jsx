import "./Notification.css";

const Notification = ({ title, subtitle }) => {
  return (
    <div className="notification">
      <h1>{title}</h1>
      <h3>{subtitle}</h3>
    </div>
  );
};

export default Notification;
