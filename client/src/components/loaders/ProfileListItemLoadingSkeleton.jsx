const ProfileListItemLoadingSkeleton = ({ count }) => (
  <div className="animate-pulse space-y-4 w-full">
    {[...Array(count)].map((_, idx) => (
      <div key={idx} className="flex items-center space-x-4  rounded-xl">
        <div className="w-12 h-12 bg-gray-300  dark:bg-gray-300/50   rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-300  dark:bg-gray-300/50  rounded w-3/4"></div>
          <div className="h-3 bg-gray-300  dark:bg-gray-300/50   rounded w-1/2"></div>
        </div>
        <div className="w-20 h-8 bg-gray-300  dark:bg-gray-300/50  rounded-full"></div>
      </div>
    ))}
  </div>
);

export default ProfileListItemLoadingSkeleton;
