const BaseButton = ({ label, className, onClick, children, disabled }) => {
  return (
    <button
      className={`py-2 px-6 cursor-pointer inline-flex justify-center items-center border transition-all duration-150 ease-in-out rounded-xl ${
        disabled ? "cursor-not-allowed opacity-30" : ""
      } active:scale-90 active:bg-gray-200
       ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {/* {label || children} */}
      {children ?? label}
    </button>
  );
};

export default BaseButton;
