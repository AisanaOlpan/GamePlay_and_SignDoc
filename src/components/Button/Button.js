import classes from "./Button.module.css";

const Button = (props) => {
  const btnType = props.type;
  const htmlFor = `${btnType} - ${Math.random()}`;
  return (
    <button
      className={classes.Button}
      type={btnType}
      id={htmlFor}
      value={props.value}
      onClick={props.jnClick}
    >
      {props.value}
    </button>
  );
};

export default Button;
