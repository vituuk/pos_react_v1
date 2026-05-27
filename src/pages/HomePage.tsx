import CountNumber from "../components/countNumber";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <div className="flex gap-4">
        <Link to={"/product"}>Home Page</Link>
        <Link to={"/product"}>Product Page</Link>
      </div>
      <CountNumber />
    </>
  );
};

export default Home;