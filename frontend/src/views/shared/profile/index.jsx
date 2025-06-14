import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Banner from "./components/Banner";
import General from "./components/General";
import ChangePassword from "./components/ChangePass";

const ProfileOverview = () => {
  const [loading, setLoading] = useState(true);
  const { user, isLoading, isError } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  if (loading || isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: Failed to load profile</div>;
  if (!user) return <div>No user data found</div>;

  return (
    <div className="flex w-full flex-col gap-5">
      {/* Main Content Grid */}
      <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Left Column - Banner and Project */}
        <div className="flex flex-col gap-5 lg:col-span-5 2xl:col-span-4">
          {/* Banner Section */}
          <div className="w-full">
            <Banner userData={user} />
          </div>

          {/* Project Section */}
          <div className="w-full">
            <ChangePassword />
          </div>
        </div>

        {/* Right Column - General */}
        <div className="lg:col-span-7 2xl:col-span-8">
          <General userData={user} />
        </div>
      </div>
    </div>
  );
};

export default ProfileOverview;
