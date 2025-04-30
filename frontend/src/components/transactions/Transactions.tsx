import React from "react";
import {
  X,
  CreditCard,
  Calendar,
  User,
  DollarSign,
  Building as BuildingStore,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

interface TransactionDetailModalProps {
  transaction: any;
  onClose: () => void;
}

const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  transaction,
  onClose,
}) => {
  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const getStatusIcon = () => {
    switch (transaction.status) {
      case "completed":
        return <CheckCircle size={18} className="text-green-500" />;
      case "failed":
        return <XCircle size={18} className="text-red-500" />;
      case "pending":
        return <Clock size={18} className="text-amber-500" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (transaction.status) {
      case "completed":
        return "Completed";
      case "failed":
        return "Failed";
      case "pending":
        return "Pending";
      default:
        return "";
    }
  };

  const getStatusColor = () => {
    switch (transaction.status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={stopPropagation}
      >
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">
            Transaction Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-sm text-gray-500">Transaction ID</p>
              <p className="text-xl font-semibold text-gray-900">
                {transaction.id}
              </p>
            </div>
            <div
              className={`px-3 py-1 rounded-full border ${getStatusColor()} flex items-center`}
            >
              {getStatusIcon()}
              <span className="ml-1 text-sm font-medium">
                {getStatusText()}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex items-start">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <DollarSign size={20} className="text-blue-700" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Amount</p>
                <p className="text-lg font-semibold text-gray-900">
                  ${transaction.amount.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-purple-100 p-2 rounded-lg mr-3">
                <Calendar size={20} className="text-purple-700" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Date & Time</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(transaction.date).toLocaleDateString()} at{" "}
                  {new Date(transaction.date).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 mb-6">
            <h3 className="text-md font-medium text-gray-900 mb-3">
              Payment Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Card Type</p>
                <div className="flex items-center mt-1">
                  <CreditCard size={16} className="text-gray-400 mr-1" />
                  <p className="text-sm font-medium text-gray-900">
                    {transaction.cardType}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Card Number</p>
                <p className="text-sm font-medium text-gray-900">
                  {transaction.cardNumber}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Cardholder</p>
                <div className="flex items-center mt-1">
                  <User size={16} className="text-gray-400 mr-1" />
                  <p className="text-sm font-medium text-gray-900">
                    {transaction.cardHolder}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Authorization Code</p>
                <p className="text-sm font-medium text-gray-900">
                  {transaction.authCode || "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 mb-6">
            <h3 className="text-md font-medium text-gray-900 mb-3">
              Merchant Information
            </h3>

            <div className="flex items-start">
              <div className="bg-green-100 p-2 rounded-lg mr-3">
                <BuildingStore size={20} className="text-green-700" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Merchant</p>
                <p className="text-lg font-semibold text-gray-900">
                  {transaction.merchant}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {transaction.merchantId || "ID: Unknown"}
                </p>
              </div>
            </div>
          </div>

          {transaction.description && (
            <div className="border border-gray-200 rounded-lg p-4 mb-6">
              <h3 className="text-md font-medium text-gray-900 mb-2">
                Description
              </h3>
              <p className="text-sm text-gray-600">{transaction.description}</p>
            </div>
          )}

          {transaction.status === "failed" && transaction.failureReason && (
            <div className="border border-red-200 bg-red-50 rounded-lg p-4 mb-6">
              <h3 className="text-md font-medium text-red-800 mb-2">
                Failure Reason
              </h3>
              <p className="text-sm text-red-600">
                {transaction.failureReason}
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Download Receipt
            </button>
            {transaction.status === "failed" && (
              <button className="px-4 py-2 bg-blue-700 text-white rounded-md text-sm font-medium hover:bg-blue-800 transition-colors">
                Retry Transaction
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailModal;
