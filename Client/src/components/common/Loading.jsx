import { LoaderCircle } from "lucide-react";

const Loading = ({
  size = 20,
  className = "",
}) => {
  return (
    <LoaderCircle
      size={size}
      className={`animate-spin ${className}`}
    />
  );
};

export default Loading;