import React, { useState } from 'react';
import { AlertCircle, X, Bell } from 'lucide-react';
import toast from 'react-hot-toast';

const AlertBanner = ({ message, type = "critical", onDismiss, onAction }) => {
  const [isDismissed, setIsDismissed] = useState(false);

  const bgConfig = {
    critical: { bg: "bg-red-600 hover:bg-red-700", icon: "🚨", action: "Address Now" },
    warning: { bg: "bg-yellow-500 hover:bg-yellow-600", icon: "⚠️", action: "Review" },
    info: { bg: "bg-blue-500 hover:bg-blue-600", icon: "ℹ️", action: "Learn More" }
  };

  const config = bgConfig[type] || bgConfig.critical;

  if (isDismissed) return null;

  const handleAction = () => {
    if (onAction) {
      onAction();
    } else {
      toast.success("Action processed");
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    if (onDismiss) {
      onDismiss();
    }
  };

  return (
    <div className={`w-full ${config.bg} text-white p-4 flex items-center justify-between font-bold shadow-lg z-50 transition-all duration-300 group`}>
      <div className="flex items-center gap-3">
        <span className="text-2xl animate-bounce">{config.icon}</span>
        <span className="text-base md:text-lg">{message}</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={handleAction}
          className="px-4 py-1.5 rounded-lg bg-white text-red-600 font-bold text-sm hover:bg-red-50 transition-colors active:scale-95"
        >
          {config.action}
        </button>
        <button
          onClick={handleDismiss}
          className="p-1.5 hover:bg-white/20 rounded-lg transition-colors active:scale-95"
          title="Dismiss this alert"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default AlertBanner;
