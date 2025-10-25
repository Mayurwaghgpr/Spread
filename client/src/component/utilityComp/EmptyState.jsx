const EmptyState = ({ Icon, heading, description }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center w-full ">
    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
      {Icon}
    </div>
    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
      {heading}
    </h3>
    <p className="text-gray-600 dark:text-gray-400 max-w-sm text-sm ">
      {description}
    </p>
  </div>
);

export default EmptyState;
