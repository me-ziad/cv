import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Overview from "./Dashboard/Overview";
import { fetchPublicProfile } from "./redux/profileSlice";
  
export default function SeekerOverviewPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const seeker = useSelector((state: any) => state.profile.data);

useEffect(() => {
  if (id) {
    dispatch(fetchPublicProfile(id));
   }
}, [id, dispatch]);

  if (!seeker) return <p>Loading...</p>;

  return <Overview isPublic />;
}
