const Form = ({
  title,
  userId,
  userPassword,
  username,
  setUsername,
  password,
  setPassword,
  handleSubmit,
  error,
  notificationError,
  success,
  notificationSuccess,
}) => {
  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>{title}</h2>

      <div className="form-group">
        <label htmlFor={userId}>User Name</label>
        <input
          type="text"
          id={userId}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor={userPassword}>Password</label>
        <input
          type="password"
          id={userPassword}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button type="submit" className="btn form-btn">
        {title}
      </button>
      {success && <span className="success">{notificationSuccess}</span>}
      {error && <span className="alert">{notificationError}</span>}
    </form>
  );
};

export default Form;
