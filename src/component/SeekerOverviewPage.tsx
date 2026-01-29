import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Overview from "./Dashboard/Overview";
import { fetchProfile } from "./redux/profileSlice";

export default function SeekerOverviewPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const seeker = useSelector((state: any) => state.profile.data);

  useEffect(() => {
    if (id) dispatch(fetchProfile(id));
  }, [id, dispatch]);

  return seeker ? <Overview isPublic /> : <p>Loading...</p>;
}