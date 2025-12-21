export const getStatusColor = (status: string) => {
  switch (status) {
    case "OPEN":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
    case "IN_PROGRESS":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300";
    case "RESOLVED":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
    case "CLOSED":
      return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "CRITICAL":
      return "text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400";
    case "HIGH":
      return "text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400";
    case "MEDIUM":
      return "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400";
    case "LOW":
      return "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400";
    default:
      return "text-gray-600 bg-gray-50";
  }
};
