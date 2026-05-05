import {CheckCircle, XCircle, Clock, Package, Truck } from "lucide-react";

export const getStatusIcon = (status: string) => {
    switch (status) {
        case "pending": return <Clock size={14} className="text-orange-500" />;
        case "processing": return <Package size={14} className="text-blue-500" />;
        case "shipped": return <Truck size={14} className="text-purple-500" />;
        case "delivered": return <CheckCircle size={14} className="text-green-500" />;
        case "cancelled": return <XCircle size={14} className="text-red-500" />;
        case "approved": return <CheckCircle size={14} className="text-green-500" />;
        case "rejected": return <XCircle size={14} className="text-red-500" />;
        default: return null;
    }
};