  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-600 bg-green-50 border-green-100";
      case "rejected":
        return "text-red-600 bg-red-50 border-red-100";
      default:
        return "text-yellow-600 bg-yellow-50 border-yellow-100";
    }
  };
  export default getStatusColor;