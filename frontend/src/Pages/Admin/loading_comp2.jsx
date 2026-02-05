import { useContext } from "react";
import { Navigate } from "react-router-dom"
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { EventAppContext } from "../../Context/EventContext";

const Loading_comp2 = ({ loading,children}) => {
  const { isAuthenticated } = useContext(EventAppContext);

  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "white",
  };

  if (loading) return <div className="bg-black h-screen flex justify-center items-center flex-col">
     <Box sx={{ display: 'flex' }}>
      <CircularProgress size={100}/>
    </Box>
  </div>;

  if (!isAuthenticated) return <Navigate to="/Home" />;

  return children || <div className="hidden">⚠ No child component provided</div>;
};
export default Loading_comp2;